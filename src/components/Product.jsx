import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios"; // axios with baseURL configured
import unplugged from "../assets/unplugged.png";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(unplugged);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setProduct(res.data);
        fetchImage(res.data.id);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    const fetchImage = async (productId) => {
      try {
        const res = await axios.get(`/product/${productId}/image`, {
          responseType: "blob",
        });
        setImageUrl(URL.createObjectURL(res.data));
      } catch (err) {
        console.warn("Image not found, using default.");
        setImageUrl(unplugged);
      }
    };

    fetchProductDetails();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`/product/${id}`);
      removeFromCart(id);
      refreshData();
      alert("Product deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEditClick = () => navigate(`/product/update/${id}`);

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading product details...
      </h2>
    );
  }

  return (
    <div className="containers" style={{ display: "flex", padding: "2rem" }}>
      <img
        src={imageUrl}
        alt={product.name}
        style={{ width: "50%", height: "auto", objectFit: "cover", borderRadius: "8px" }}
      />

      <div className="right-column" style={{ width: "50%", paddingLeft: "2rem" }}>
        <div className="product-description">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "1rem", fontWeight: "lighter" }}>{product.category}</span>
            <h6 style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
              Listed: {new Date(product.releaseDate).toLocaleDateString()}
            </h6>
          </div>

          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: "capitalize" }}>
            {product.name}
          </h1>
          <i style={{ fontSize: "1rem", color: "#555" }}>~ {product.brand}</i>

          <p style={{ fontWeight: "bold", marginTop: "1rem" }}>PRODUCT DESCRIPTION:</p>
          <p style={{ marginBottom: "1rem" }}>{product.description}</p>
        </div>

        <div className="product-price">
          <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>
            ₹{product.price}
          </span>

          <button
            className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.productAvailable}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              backgroundColor: product.productAvailable ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: product.productAvailable ? "pointer" : "not-allowed",
              marginTop: "1rem",
            }}
          >
            {product.productAvailable ? "Add to Cart" : "Out of Stock"}
          </button>

          <h6 style={{ marginTop: "1rem" }}>
            Stock Available:{" "}
            <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
          </h6>
        </div>

        <div className="update-button" style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            onClick={handleEditClick}
            style={{
              padding: "0.8rem 2rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update
          </button>

          <button
            onClick={deleteProduct}
            style={{
              padding: "0.8rem 2rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
