import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const Orders = () => {
  const { orders_farmer, vieworder } = useAuthStore();

  useEffect(() => {
    vieworder(); // Fetch orders on mount
  }, []);
  const navigate = useNavigate()
  useEffect(() => {
    console.log(orders_farmer);
  }, [orders_farmer]);

  return (
    <div className="p-5 md:p-10 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
      >
        ◀ Back
      </Link>

      <h2 className="text-3xl font-bold mb-8">Orders</h2>

      {/* Responsive Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders_farmer?.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Order header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Tracking #{order.tracking_id.slice(0, 8)}...
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "Paid" || order.status === "Shipped"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order details */}
            <div className="text-gray-700 space-y-1 mb-4">
              {/* <p>
                <span className="font-semibold">City:</span> {order.delivery?.city || "Unknown"}
              </p> */}
              <p>
                <span className="font-semibold">Distance:</span>{" "}
                {order.distance} km
              </p>
              <p>
                <span className="font-semibold">Quantity:</span>{" "}
                {order.quantity}
              </p>
            </div>

            {/* Delivery address */}
            {order.delivery && (
              <>
                <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
                <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
                  <p><span className="font-semibold">Address:</span> {order.delivery.address}</p>
                  <p><span className="font-semibold">City:</span> {order.delivery.city}</p>
                  <p><span className="font-semibold">Pincode:</span> {order.delivery.pincode}</p>
                  <p><span className="font-semibold">Phone:</span> {order.delivery.phone}</p>
                </div>
              </>
            )}

            {/* Details Button */}
              
            <button onClick={()=>{navigate(`/track?tracking_id=${order.tracking_id}`)}} className="mt-5 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Track
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
