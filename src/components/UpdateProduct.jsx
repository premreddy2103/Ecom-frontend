import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios"; // ✅ baseURL set
import unplugged from "../assets/unplugged.png";

const UpdateProduct = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(unplugged);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setUpdateProduct(res.data);

        try {
          const imgRes = await axios.get(`/product/${id}/image`, {
            responseType: "blob",
          });
          const imgFile = new File([imgRes.data], res.data.imageName, {
            type: imgRes.data.type,
          });
          setImage(imgFile);
          setImagePreview(URL.createObjectURL(imgFile));
        } catch (err) {
          setImagePreview(unplugged);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) {
      formData.append("imageFile", image);
    }

    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], {
        type: "application/json",
      })
    );

    try {
      await axios.put(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Failed to update product.");
    }
  };

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={updateProduct.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input
              type="text"
              className="form-control"
              name="brand"
              value={updateProduct.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              className="form-control"
              name="stockQuantity"
              value={updateProduct.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={updateProduct.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="laptop">Laptop</option>
              <option value="headphone">Headphone</option>
              <option value="mobile">Mobile</option>
              <option value="electronics">Electronics</option>
              <option value="toys">Toys</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Release Date</label>
            <input
              type="date"
              className="form-control"
              name="releaseDate"
              value={updateProduct.releaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Image</label>
            <img
              src={imagePreview}
              alt="Product Preview"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={updateProduct.productAvailable}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="gridCheck">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success">
              Submit Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
