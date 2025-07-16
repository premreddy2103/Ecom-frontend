import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const updatedCartItems = await Promise.all(
          cart.map(async (item) => {
            let imageUrl = "";
            let imageFile = null;

            try {
              const response = await axios.get(
                `https://ecom-project1-d49s.onrender.com/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              imageUrl = URL.createObjectURL(response.data);
              imageFile = new File([response.data], `${item.id}.jpg`, {
                type: response.data.type,
              });
            } catch (error) {
              console.error("Image fetch failed:", error);
              imageUrl = "/fallback.jpg"; // fallback image if needed
            }

            return {
              ...item,
              imageUrl,
              imageFile,
              quantity: item.quantity || 1,
            };
          })
        );
        setCartItems(updatedCartItems);
      } catch (error) {
        console.error("Cart fetch error:", error);
      }
    };

    if (cart.length > 0) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.quantity < item.stockQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedProduct = {
          ...item,
          stockQuantity: item.stockQuantity - item.quantity,
        };

        const formData = new FormData();
        if (item.imageFile) {
          formData.append("imageFile", item.imageFile);
        }
        formData.append(
          "product",
          new Blob([JSON.stringify(updatedProduct)], {
            type: "application/json",
          })
        );

        await axios.put(
          `https://ecom-project1-d49s.onrender.com/api/product/${item.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Cart</div>
        {cartItems.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="item" style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "1rem" }}
                    />
                    <div style={{ flex: 1 }}>
                      <h6>{item.brand}</h6>
                      <p>{item.name}</p>
                    </div>
                    <div className="quantity" style={{ display: "flex", alignItems: "center" }}>
                      <button onClick={() => handleDecreaseQuantity(item.id)}>
                        <i className="bi bi-dash-square-fill"></i>
                      </button>
                      <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                      <button onClick={() => handleIncreaseQuantity(item.id)}>
                        <i className="bi bi-plus-square-fill"></i>
                      </button>
                    </div>
                    <div style={{ margin: "0 1rem", fontWeight: "bold" }}>
                      ₹{item.price * item.quantity}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="total" style={{ padding: "1rem 0", fontWeight: "bold" }}>
              Total: ₹{totalPrice}
            </div>
            <Button
              className="btn btn-success"
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
