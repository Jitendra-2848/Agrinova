import React from "react";
import { useNavigate } from "react-router-dom";

const DeliveryHistory = () => {
  // Dummy delivery history
  const deliveredOrders = [
    {
      id: 101,
      product: "Fresh Tomatoes",
      pickup: "Nashik, Maharashtra",
      drop: "Mumbai, Maharashtra",
      deliveredOn: "2025-11-10 14:30",
      charges: 500,
      distance: "180 km",
      status: "Delivered",
    },
    {
      id: 102,
      product: "Organic Wheat",
      pickup: "Indore, MP",
      drop: "Ahmedabad, Gujarat",
      deliveredOn: "2025-11-12 10:00",
      charges: 1200,
      distance: "500 km",
      status: "Delivered",
    },
    {
      id: 103,
      product: "Apples",
      pickup: "Shimla, HP",
      drop: "Delhi",
      deliveredOn: "2025-11-15 09:15",
      charges: 800,
      distance: "350 km",
      status: "Delivered",
    },
  ];
  const totalEarnings = deliveredOrders.reduce((sum, order) => sum + order.charges, 0);
  const navigate = useNavigate()
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Delivery History 📦
      </h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Earnings</h2>
        <div className="text-3xl font-bold text-green-600">${totalEarnings}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                Order ID
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                Product
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                Pickup → Drop
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                Distance
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                Transport Charges
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                Delivered On
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.product}</td>
                <td className="px-6 py-4">
                  {order.pickup} → {order.drop}
                </td>
                <td className="px-6 py-4">{order.distance}</td>
                <td className="px-6 py-4">${order.charges}</td>
                <td className="px-6 py-4">{order.deliveredOn}</td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryHistory;
