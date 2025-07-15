import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css"; // make sure this CSS file exists

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
    const val = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: val });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

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
      .then((res) => {
        alert("Product added successfully");
        navigate("/");
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Error adding product");
      });
  };

  return (
    <div className="add-product-container">
      <form onSubmit={submitHandler} className="add-product-form">
        <div className="form-row">
          <div>
            <label>Name</label>
            <input type="text" name="name" value={product.name} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Brand</label>
            <input type="text" name="brand" value={product.brand} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="form-row full-width">
          <label>Description</label>
          <input type="text" name="description" value={product.description} onChange={handleInputChange} required />
        </div>

        <div className="form-row">
          <div>
            <label>Price</label>
            <input type="number" name="price" value={product.price} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Category</label>
            <select name="category" value={product.category} onChange={handleInputChange} required>
              <option value="">Select category</option>
              <option value="Mobile">Mobile</option>
              <option value="Laptop">Laptop</option>
              <option value="Watch">Watch</option>
              <option value="TV">TV</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Stock Quantity</label>
            <input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Release Date</label>
            <input type="date" name="releaseDate" value={product.releaseDate} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" required />
          </div>
          <div className="checkbox-field">
            <label>
              <input type="checkbox" name="productAvailable" checked={product.productAvailable} onChange={handleInputChange} />
              Product Available
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AddProduct;
