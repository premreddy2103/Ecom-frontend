import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    try {
      await axios.post(
        "https://ecom-project1-d49s.onrender.com/api/product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Product added successfully!");
      navigate("/");

      // Optional: refresh the window to trigger re-fetch
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Failed to add product. Try again.");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form className="add-product-form" onSubmit={submitHandler}>
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          required
        />

        <label>Brand</label>
        <input
          type="text"
          name="brand"
          value={product.brand}
          onChange={handleInputChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleInputChange}
          required
        />

        <label>Price (₹)</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          required
        />

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleInputChange}
          required
        />

        <label>Stock Quantity</label>
        <input
          type="number"
          name="stockQuantity"
          value={product.stockQuantity}
          onChange={handleInputChange}
          required
        />

        <label>Release Date</label>
        <input
          type="date"
          name="releaseDate"
          value={product.releaseDate}
          onChange={handleInputChange}
          required
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="productAvailable"
            checked={product.productAvailable}
            onChange={handleInputChange}
          />
          Product Available
        </label>

        <label>Upload Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "100px", height: "100px", marginTop: "10px" }}
          />
        )}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
