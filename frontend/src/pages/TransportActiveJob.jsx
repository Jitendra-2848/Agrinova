import React from "react";
import { FaTruck, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ActiveDelivery = () => {
  const activeDeliveries = [
    {
      id: 201,
      product: "Fresh Tomatoes",
      pickup: "Nashik, Maharashtra",
      drop: "Mumbai, Maharashtra",
      remainingDistance: 120, // in km
      totalDistance: 180,
      charges: 500,
      estimatedDelivery: "2025-11-16 18:30",
    },
    {
      id: 202,
      product: "Organic Wheat",
      pickup: "Indore, MP",
      drop: "Ahmedabad, Gujarat",
      remainingDistance: 250,
      totalDistance: 400,
      charges: 1200,
      estimatedDelivery: "2025-11-17 11:00",
    },
    {
      id: 203,
      product: "Apples",
      pickup: "Shimla, HP",
      drop: "Delhi",
      remainingDistance: 180,
      totalDistance: 300,
      charges: 800,
      estimatedDelivery: "2025-11-16 21:00",
    },
  ];
  const navigate = useNavigate()
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
        <button
        onClick={() => navigate("/")}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <FaTruck /> Active Deliveries
      </h1>

      {activeDeliveries.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No active deliveries at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeDeliveries.map((order) => {
            const progress = ((order.totalDistance - order.remainingDistance) / order.totalDistance) * 100;
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    In Transit
                  </span>
                </div>
                <p className="text-gray-700 mb-2 font-semibold">{order.product}</p>
                <div className="flex items-center text-gray-600 mb-2 gap-2">
                  <FaMapMarkerAlt className="text-green-500" />
                  <span>{order.pickup}</span>
                  <span className="mx-1">→</span>
                  <span>{order.drop}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Distance Remaining</span>
                    <span>{order.remainingDistance} km</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 text-gray-700">
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="text-green-600" /> ${order.charges}
                  </div>
                  <div className="text-sm text-gray-500">
                    ETA: {order.estimatedDelivery}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveDelivery;
