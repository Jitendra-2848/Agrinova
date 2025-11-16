import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LocationUpdate = () => {
  const initialOrders = [
    {
      id: 101,
      product: "Fresh Tomatoes",
      pickup: "Nashik, Maharashtra",
      drop: "Mumbai, Maharashtra",
      currentPincode: "422001",
      remainingDistance: "180 km",
    },
    {
      id: 102,
      product: "Organic Wheat",
      pickup: "Indore, MP",
      drop: "Ahmedabad, Gujarat",
      currentPincode: "452001",
      remainingDistance: "500 km",
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [orderId, setOrderId] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = () => {
    const orderIndex = orders.findIndex((order) => order.id === Number(orderId));
    if (orderIndex === -1) {
      setMessage("❌ Order ID not found");
      return;
    }
    const updatedOrders = [...orders];
    updatedOrders[orderIndex].currentPincode = newPincode;
    setOrders(updatedOrders);
    setMessage(`✅ Location updated for Order ID ${orderId}`);
    setOrderId("");
    setNewPincode("");
  };
  const navigate = useNavigate()
  const handleSelectOrder = (id) => {
    setOrderId(id);
    setMessage(""); // clear any previous message
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
        <button
        onClick={() => navigate("/")}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Update Product Location 🚚</h1>

      {/* Update Form */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <input
            type="number"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Enter new Pincode"
            value={newPincode}
            onChange={(e) => setNewPincode(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleUpdate}
            className="mt-2 md:mt-0 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Update Location
          </button>
        </div>
        {message && <p className="text-gray-700 font-medium">{message}</p>}
      </div>

      {/* Orders List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex flex-col md:flex-row md:gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800">{order.product}</h3>
                  <p className="text-gray-600 text-sm">
                    Pickup: <span className="font-medium">{order.pickup}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Drop: <span className="font-medium">{order.drop}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Current Pincode: <span className="font-medium">{order.currentPincode}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Remaining Distance: <span className="font-medium">{order.remainingDistance}</span>
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleSelectOrder(order.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-2 md:mt-0"
                >
                  Update This Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationUpdate;
