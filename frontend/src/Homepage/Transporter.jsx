// DashboardMain.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AgriMarketNavbar from "./Navbar";
import RecentActivity from "./Recent";
import { useAuthStore } from "../lib/store";

const DashboardMain = () => {
  const navigate = useNavigate();
  const {AuthUser} = useAuthStore()
  // Sample data (replace with real values later)
  const userName = "Mike";
  const initials = "M";
  const activeDeliveries = 0;
  const totalDistance = 2450; // km
  const completedJobs = 342;
  const earnings = 8920; // currency
  console.log(AuthUser)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <AgriMarketNavbar />

      <main className="max-w-6xl mx-auto pt-6 pb-10 px-4 md:px-6">
        {/* Welcome Box */}
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
              You have {activeDeliveries} active deliveries today. Stay safe on
              the road with GreenLogistic Express.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
              TRANSPORTER
            </span>
          </div>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Deliveries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 9V7a4 4 0 014-4h10a4 4 0 014 4v2"></path>
                <rect x="3" y="10" width="18" height="11" rx="2"></rect>
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {activeDeliveries}
            </div>
            <div className="text-sm text-gray-500 mt-1">Active Deliveries</div>
          </div>

          {/* Total Distance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2v20m0 0l-7-7m7 7l7-7"></path>
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalDistance} km
            </div>
            <div className="text-sm text-gray-500 mt-1">Total Distance</div>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {completedJobs}
            </div>
            <div className="text-sm text-gray-500 mt-1">Completed Jobs</div>
          </div>

          {/* Earnings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full mb-3">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v8m0 4v2m6-2v2M6 20v2"></path>
                <rect x="6" y="2" width="12" height="16" rx="3"></rect>
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{earnings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Earnings</div>
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
            Quickly manage your transport jobs, deliveries, and history from
            here.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Accept New Job */}
            <button
              onClick={() => navigate("/transport")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <span className="text-xl leading-none">+</span>
              Accept New Job
            </button>

            {/* Update Delivery */}
            <button
              onClick={() => navigate("/delivery_update")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M8 17l4-4-4-4m5 4h10"></path>
              </svg>
              Update Delivery
            </button>

            {/* Active Jobs */}
            <button
              onClick={() => navigate("/Active_delivery")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 7v6a2 2 0 01-2 2"></path>
                <rect x="3" y="4" width="15" height="13" rx="2"></rect>
              </svg>
              Active Jobs
            </button>

            {/* Delivery History */}
            <button
              onClick={() => navigate("/delivery_history")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 text-xs md:text-sm"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M7 10v12"></path>
                <rect x="9" y="3" width="10" height="18" rx="2"></rect>
              </svg>
              Delivery History
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </main>
    </div>
  );
};

export default DashboardMain;