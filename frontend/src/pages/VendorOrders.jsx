import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const MyOrders = () => {
  const { Myorder, Checkorder, AuthUser,RemoveBuy } = useAuthStore();
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (AuthUser?._id) {
      Checkorder(AuthUser._id); // fetch orders
    }
  }, [AuthUser]);
  useEffect(() => {
    setOrders(Myorder);
    console.log(Myorder)
  }, [Myorder]);

  const statusColors = {
    Delivered: "bg-green-100 text-green-700",
    Shipping: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <button
        onClick={() => {RemoveBuy();navigate("/")}}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Orders</h1>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length > 0 ? (
          orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border p-4 flex flex-col"
            >
              {/* PRODUCT NAME */}
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Order ID: {o._id}
              </p>

              {/* DETAILS */}
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <p>Tracking ID: {o.tracking_id}</p>
                <p>Reached: {o.reached}</p>
              </div>

              {/* STATUS */}
              <div className="flex justify-between items-center mt-4">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    statusColors[o.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {o.status}
                </span>
              </div>

              {/* TRACK BUTTON */}
              <button
                onClick={() => navigate(`/track?tracking_id=${o.tracking_id}`)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
              >
                Track Order
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <h1 className="text-center text-cyan-700">
              You haven't bought anything yet.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
