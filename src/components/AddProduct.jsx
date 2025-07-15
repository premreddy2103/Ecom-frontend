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
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
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
        alert("Error adding product");
        console.error(error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-lg rounded-lg mt-10 bg-white">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleInputChange} className="w-full border p-2" required />
        <input name="brand" placeholder="Brand" onChange={handleInputChange} className="w-full border p-2" required />
        <textarea name="description" placeholder="Description" onChange={handleInputChange} className="w-full border p-2" required />
        <input name="price" placeholder="Price" type="number" onChange={handleInputChange} className="w-full border p-2" required />
        <input name="category" placeholder="Category" onChange={handleInputChange} className="w-full border p-2" required />
        <input name="stockQuantity" placeholder="Stock Quantity" type="number" onChange={handleInputChange} className="w-full border p-2" required />
        <input name="releaseDate" placeholder="Release Date" type="date" onChange={handleInputChange} className="w-full border p-2" />
        <div className="flex items-center">
          <label className="mr-2">Available:</label>
          <input type="checkbox" name="productAvailable" checked={product.productAvailable} onChange={handleInputChange} />
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
