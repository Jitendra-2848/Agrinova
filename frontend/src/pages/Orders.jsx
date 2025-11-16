import React from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  // Dummy Orders With Products
  const orders = [
    {
      id: 101,
      customer: "Alice Johnson",
      date: "2025-01-10",
      status: "Shipped",
      total: 89.98,
      products: [
        { id: 1, name: "Wireless Bluetooth Headphones", qty: 1, price: 59.99 },
        { id: 2, name: "Stainless Steel Water Bottle", qty: 1, price: 29.99 },
      ],
    },
    {
      id: 102,
      customer: "Mark Lee",
      date: "2025-01-12",
      status: "Processing",
      total: 34.99,
      products: [{ id: 3, name: "Gaming Mouse RGB", qty: 1, price: 34.99 }],
    },
  ];

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
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Order header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                ${
                  order.status === "Shipped"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order details */}
            <div className="text-gray-700 space-y-1 mb-4">
              <p>
                <span className="font-semibold">Customer:</span> {order.customer}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(order.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Total:</span> $
                {order.total.toFixed(2)}
              </p>
            </div>

            {/* Product list */}
            <h4 className="font-semibold text-gray-900 mb-2">Products</h4>

            <div className="bg-gray-50 border rounded-lg divide-y">
              {order.products.map((p) => (
                <div
                  key={p.id}
                  className="p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-600">Qty: {p.qty}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${p.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Details Button */}
            <button className="mt-5 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
