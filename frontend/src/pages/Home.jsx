import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // ✅ Load products with error handling
  const loadProducts = async () => {
    try {
      const res = await api.get(
        `/products?search=${search}&category=${category}`
      );
      console.log(res.data); // 👈 debug
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  // ✅ Add to cart safe version
  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      const res = await api.post(`/cart/add`, { userId, productId });

      const total = res.data.cart.items.reduce(
        (sum, item) =>
          sum + (item.productId?.price || 0) * item.quantity,
        0
      );

      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Search + Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border px-4 py-2 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 border px-4 py-2 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Tablets">Tablets</option>
        </select>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-3 rounded shadow hover:shadow-lg transition"
          >
            <Link to={`/product/${product._id}`}>
              
              {/* ✅ FIXED IMAGE URL */}
              <img
                src={`http://localhost:5001${product.image}`}
                alt={product.title}
                className="w-full h-40 object-contain bg-white rounded"
              />

              <h2 className="mt-2 font-semibold text-lg">
                {product.title}
              </h2>
            </Link>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-gray-700 font-semibold">
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}