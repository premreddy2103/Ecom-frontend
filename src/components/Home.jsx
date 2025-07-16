import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import axios from "axios";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [productsWithImages, setProductsWithImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshData(); // refresh product list from backend
  }, [refreshData]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!data || data.length === 0) return;

      setIsLoading(true);
      try {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const res = await axios.get(
                `https://ecom-project1-d49s.onrender.com/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(res.data);
              return { ...product, imageUrl };
            } catch (err) {
              return { ...product, imageUrl: unplugged };
            }
          })
        );
        setProductsWithImages(updatedProducts);
      } catch (err) {
        console.error("Error loading images", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [data]);

  const filteredProducts = selectedCategory
    ? productsWithImages.filter((product) => product.category === selectedCategory)
    : productsWithImages;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: "100px", height: "100px" }} />
      </h2>
    );
  }

  if (isLoading) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        Loading products...
      </h2>
    );
  }

  return (
    <div
      className="grid"
      style={{
        marginTop: "64px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {filteredProducts.length === 0 ? (
        <h2 className="text-center">No Products Available</h2>
      ) : (
        filteredProducts.map((product) => {
          const { id, brand, name, price, productAvailable, imageUrl } = product;
          return (
            <div
              className="card mb-3"
              style={{
                width: "250px",
                height: "360px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: productAvailable ? "#fff" : "#ccc",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
              }}
              key={id}
            >
              <Link
                to={`/product/${id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={imageUrl || unplugged}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    padding: "5px",
                    margin: "0",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <div
                  className="card-body"
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div>
                    <h5 className="card-title" style={{ marginBottom: "10px", fontSize: "1.2rem" }}>
                      {name.toUpperCase()}
                    </h5>
                    <i style={{ fontStyle: "italic", fontSize: "0.8rem" }}>~ {brand}</i>
                  </div>
                  <hr />
                  <div>
                    <h5 className="card-text" style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      ₹{price}
                    </h5>
                  </div>
                  <button
                    className="btn-hover color-9"
                    style={{ marginTop: "10px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    disabled={!productAvailable}
                  >
                    {productAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
