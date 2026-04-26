import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(
    JSON.parse(localStorage.getItem("selectedAddress")) || null
  );
  const [cart, setCart] = useState(null);

  // 🔹 Load data
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const cartRes = await api.get(`/cart/${userId}`);
        setCart(cartRes.data);

        const addrRes = await api.get(`/address/${userId}`);
        setAddresses(addrRes.data);

        if (addrRes.data.length > 0) {
          const saved = JSON.parse(localStorage.getItem("selectedAddress"));

          if (saved) {
            setSelectedAddress(saved);
          } else {
            setSelectedAddress(addrRes.data[0]);
            localStorage.setItem(
              "selectedAddress",
              JSON.stringify(addrRes.data[0])
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [userId]);

  if (!cart) return <div className="p-6">Loading...</div>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  // 🔴 DELETE ADDRESS
  const deleteAddress = async (id) => {
    try {
      await api.delete(`/address/${id}`);

      const updated = addresses.filter((a) => a._id !== id);
      setAddresses(updated);

      // अगर deleted address selected था
      if (selectedAddress?._id === id) {
        const newSelected = updated[0] || null;
        setSelectedAddress(newSelected);
        localStorage.setItem(
          "selectedAddress",
          JSON.stringify(newSelected)
        );
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // 🔹 PLACE ORDER
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        alert("Please select address");
        return;
      }

      const res = await api.post("/order/place", {
        userId,
        address: selectedAddress,
      });

      // clear selected address after order
      localStorage.removeItem("selectedAddress");

      navigate(`/order-success/${res.data.orderId}`);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Order failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <h2 className="font-semibold mb-2">Select Delivery Address</h2>

      {addresses.length === 0 ? (
        <p>No address found. Please add address first.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`border p-3 rounded ${
                selectedAddress?._id === addr._id
                  ? "border-green-600"
                  : ""
              }`}
            >
              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => {
                    setSelectedAddress(addr);
                    localStorage.setItem(
                      "selectedAddress",
                      JSON.stringify(addr)
                    );
                  }}
                  className="mr-2"
                />

                <strong>{addr.fullName}</strong>
                <p className="text-sm">
                  {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                  {addr.pincode}
                </p>
                <p className="text-sm">📞 {addr.phone}</p>
              </label>

              {/* 🔴 REMOVE BUTTON */}
              <p
                onClick={() => deleteAddress(addr._id)}
                className="text-red-500 text-sm mt-2 cursor-pointer"
              >
                Remove
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-semibold mt-6 mb-2">Order Summary</h2>
      <p className="text-lg font-bold">Total: ₹{total}</p>

      <button
        onClick={placeOrder}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Place Order (COD)
      </button>
    </div>
  );
}