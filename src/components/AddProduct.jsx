import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post("https://ecom-project1-d49s.onrender.com/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Product added successfully");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add Product</h2>
      <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={product.brand}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={product.stockQuantity}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="releaseDate"
          value={product.releaseDate}
          onChange={handleInputChange}
        />
        <label>
          Available:
          <input
            type="checkbox"
            name="productAvailable"
            checked={product.productAvailable}
            onChange={handleInputChange}
          />
        </label>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
