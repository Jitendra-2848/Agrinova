// BuyerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AgriMarketNavbar from "./Navbar.jsx";
import RecentActivity from "./VeRecent.jsx";
import { useAuthStore } from "../lib/store.js";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const {AuthUser} = useAuthStore();
  // Sample data – replace with real values later
  const userName = "Sarah";
  const initials = "SJ";
  const activeOrders = 8;
  const totalPurchases = 156;
  const wishlistItems = 23;
  const totalSpent = 12340;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <AgriMarketNavbar />

      <main className="max-w-6xl mx-auto pt-6 pb-10 px-4 md:px-6">
        {/* Welcome Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {
                  AuthUser?.profile_pic ?
                <img src={AuthUser?.profile_pic} className=" object-cover scale-150 w-16 h-full rounded-full overflow-hidden" alt="M" />
                : 
                <p className="scale-150">{AuthUser?.name?.charAt(0).toUpperCase()}</p>
                }
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Discover fresh products from local farmers and manage your orders
              in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              BUYER
            </span>
          </div>
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 6h15l-1.5 9h-13z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {activeOrders}
            </div>
            <div className="text-sm text-gray-500 mt-1">Active Orders</div>
          </div>

          {/* Total Purchases */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M16 10V8a4 4 0 00-8 0v2" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalPurchases}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Purchases</div>
          </div>

          {/* Wishlist Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 21S7 16.28 4 13.23C1.83 11.05 2.13 7.4 4.71 5.99C7.04 4.74 9.77 6.39 12 9.13C14.23 6.39 16.97 4.74 19.29 5.99C21.87 7.4 22.17 11.05 20 13.23C17 16.28 12 21 12 21Z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {wishlistItems}
            </div>
            <div className="text-sm text-gray-500 mt-1">Wishlist Items</div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-purple-100 text-purple-500 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" />
                <circle cx="7" cy="15" r="1" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Spent</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M13 10V3.5a1.5 1.5 0 10-3 0V10m-7 8V7a5 5 0 015-5h6a5 5 0 015 5v11"></path>
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Quickly explore products, manage your orders, and track deliveries.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Browse Products */}
            <button
              onClick={() => navigate("/Product")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Browse Products
            </button>

            {/* My Orders */}
            <button
              onClick={() => navigate("/MyOrder")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M16 10V8a4 4 0 00-8 0v2" />
              </svg>
              My Orders
            </button>

            {/* Favorite Sellers */}
            <button
              onClick={() => navigate("/product/1")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.75L7.12 20.52L8.27 15.02L4.55 11.24L10.04 10.62L12 5.5L13.96 10.62L19.45 11.24L15.73 15.02L16.88 20.52L12 17.75Z" />
              </svg>
              Favorite Sellers
            </button>

            {/* Track Delivery */}
            <button
              onClick={() => navigate("/track")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h3v8a2 2 0 01-2 2h-7" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
              </svg>
              Track Delivery
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </main>
    </div>
  );
};

export default BuyerDashboard;