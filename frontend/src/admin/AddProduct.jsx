import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    formData.append("image", image); // 🔥 important

    try {
      await api.post("/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />
        <input name="stock" placeholder="Stock" onChange={handleChange} />

        {/* 🔥 FILE INPUT */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="bg-blue-500 text-white p-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}