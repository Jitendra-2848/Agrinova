import React from "react";
import { useNavigate } from "react-router-dom";
import AgriMarketNavbar from "./Navbar";
import Recent from "./FaRecent.jsx";
import { useAuthStore } from "../lib/store.js";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const {AuthUser} = useAuthStore();
  // Static demo values – you can replace these with real data later
  const userName = "John";
  const initials = "JD";
  const activeCrops = 12;
  const totalRevenue = 24500;
  const productsListed = 28;
  const monthSales = 23; // %

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <AgriMarketNavbar />

      <main className="max-w-6xl mx-auto pt-6 pb-10 px-4 md:px-6">
        {/* Welcome / Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
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
              Here’s what’s going on with your farm and products today.
            </p>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              FARMER
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Crops */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <circle cx="7" cy="17" r="2.5" />
                <circle cx="19" cy="17" r="2.5" />
                <path d="M7 17v-5h7l3 5H7zm2-3v-4a2 2 0 012-2h2" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeCrops}</div>
            <div className="text-sm text-gray-500 mt-1">Active Crops</div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2v20M17 7H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H7" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Revenue</div>
          </div>

          {/* Products Listed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M16 8V6a4 4 0 00-8 0v2" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {productsListed}
            </div>
            <div className="text-sm text-gray-500 mt-1">Products Listed</div>
          </div>

          {/* This Month Sales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-purple-100 text-purple-500 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <polyline points="4 14 10 8 14 12 20 6" />
                <path d="M20 6v6h-6" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              +{monthSales}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              This Month’s Sales
            </div>
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
            Shortcuts to manage products, inventory and orders.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/addProduct")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add New Product
            </button>

            <button
              onClick={() => navigate("/manage")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M16 10V8a4 4 0 00-8 0v2" />
              </svg>
              Manage Inventory
            </button>

            <button
              onClick={() => navigate("/track")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                viewBox="0 0 24 24"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h3v8a2 2 0 01-2 2h-7" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
              </svg>
              Track Shipments
            </button>

            <button
              onClick={() => navigate("/msg")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Messages
            </button>

            <button
              onClick={() => navigate("/Order")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                viewBox="0 0 24 24"
              >
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="9" y1="11" x2="15" y2="11" />
                <line x1="9" y1="15" x2="13" y2="15" />
              </svg>
              View Orders
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm col-span-2 sm:col-span-1"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33h.09V3A2 2 0 0112 1a2 2 0 012 2v.09a1.65 1.65 0 001 1.51c.41.18.9.18 1.32 0a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001.51 1 1.65 1.65 0 00.33-1.82l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06z" />
              </svg>
              Settings
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <Recent />
      </main>
    </div>
  );
};

export default FarmerDashboard;