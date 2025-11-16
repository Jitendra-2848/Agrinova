import React from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const orders = [
    {
      id: "ORD12345",
      productName: "Fresh Tomatoes",
      productImage:
        "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg",
      qty: 5,
      totalPrice: 250,
      status: "Shipped",
      date: "2025-11-10",
    },
    {
      id: "ORD98765",
      productName: "Organic Wheat",
      productImage:
        "https://images.pexels.com/photos/3735172/pexels-photo-3735172.jpeg",
      qty: 10,
      totalPrice: 820,
      status: "Delivered",
      date: "2025-11-08",
    },
    {
      id: "ORD55221",
      productName: "Apples",
      productImage:
        "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
      qty: 3,
      totalPrice: 450,
      status: "Pending",
      date: "2025-11-12",
    },
  ];

  const statusColors = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Orders</h1>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border p-4 flex flex-col"
          >
            {/* IMAGE */}
            <img
              src={o.productImage}
              alt={o.productName}
              className="h-36 w-full object-cover rounded-lg mb-3"
            />

            {/* PRODUCT NAME */}
            <p className="text-lg font-semibold text-gray-900">
              {o.productName}
            </p>

            {/* DETAILS */}
            <div className="text-sm text-gray-600 mt-1 space-y-1">
              <p>Qty: {o.qty}</p>
              <p>Ordered: {o.date}</p>
            </div>

            {/* PRICE & STATUS */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-xl font-bold text-green-600">
                ₹{o.totalPrice}
              </p>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  statusColors[o.status]
                }`}
              >
                {o.status}
              </span>
            </div>

            {/* TRACK BUTTON */}
            <button
              onClick={() => alert(`Tracking ${o.id}`)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
            >
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyOrders;
