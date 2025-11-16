// FarmerDashboard.jsx
import React from 'react';
import Recent from './FaRecent.jsx';
import {Navigate, useNavigate} from "react-router-dom"
import AgriMarketNavbar from "./Navbar"
const FarmerDashboard = () => {
  const navigate = useNavigate()
  // const service = ({
  const userName = "John"
  const initial = "JD"
  const activeCrops = 12
  const totalRevenue = 24500
  const productsListed = 28
  const monthSales = 23
  return (
  <div>
    <AgriMarketNavbar />
    {/* Dashboard Main */}
    <div className="bg-blue-50 min-h-screen pt-6 px-6">
      {/* Welcome Box */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! <span className="inline-block">👋</span>
          </div>
          <div className="text-gray-600 text-md">Here's what's happening with your farm today.</div>
        </div>
        <div>
          <button className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition">
            FARMER
          </button>
        </div>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Active Crops */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            {/* Tractor SVG */}
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="7" cy="17" r="2.5"/>
              <circle cx="19" cy="17" r="2.5"/>
              <path d="M7 17v-5h7l3 5H7zm2-3v-4a2 2 0 012-2h2" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{activeCrops}</div>
          <div className="text-gray-500 text-base mt-2">Active Crops</div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            {/* Dollar SVG */}
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 2v20M17 7H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H7"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</div>
          <div className="text-gray-500 text-base mt-2">Total Revenue</div>
        </div>

        {/* Products Listed */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-orange-100 p-3 rounded-full mb-3">
            {/* Products (Box) SVG */}
            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="13" rx="2"/>
              <path d="M16 8V6a4 4 0 00-8 0v2"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{productsListed}</div>
          <div className="text-gray-500 text-base mt-2">Products Listed</div>
        </div>

        {/* This Month Sales */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-purple-100 p-3 rounded-full mb-3">
            {/* Trend SVG */}
            <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <polyline points="4 14 10 8 14 12 20 6" />
              <path d="M20 6v6h-6"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">+{monthSales}%</div>
          <div className="text-gray-500 text-base mt-2">This Month Sales</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M13 10V3.5a1.5 1.5 0 10-3 0V10m-7 8V7a5 5 0 015-5h6a5 5 0 015 5v11"></path>
          </svg>
          Quick Actions
        </div>
        <div className="grid grid-cols-5 gap-4">
          {/* Add New Product */}
          <button onClick={()=>{navigate("/addProduct")}} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Add New Product
          </button>
          {/* Manage Inventory */}
          <button onClick={()=>{navigate("/manage")}} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="13" rx="2"/>
              <path d="M16 10V8a4 4 0 00-8 0v2"/>
            </svg>
            Manage Inventory
          </button>
          {/* Track Shipments */}
          <button onClick={()=>{navigate("/track")}} className="bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1 hover:bg-gray-200">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h3v8a2 2 0 01-2 2h-7"/>
              <circle cx="6" cy="18" r="2"/>
              <circle cx="18" cy="18" r="2"/>
            </svg>
            Track Shipments
          </button>
          {/* Messages */}
          <button onClick={()=>{navigate("/msg")}} className="bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1 hover:bg-gray-200">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Messages
          </button>
          {/* View Orders */}
          <button onClick={()=>{navigate("/Order")}} className="bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1 hover:bg-gray-200">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
              <rect x="5" y="3" width="14" height="18" rx="2"/>
              <line x1="9" y1="7" x2="15" y2="7"/>
              <line x1="9" y1="11" x2="15" y2="11"/>
              <line x1="9" y1="15" x2="13" y2="15"/>
            </svg>
            View Orders
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
          {/* Settings */}
          <button onClick={()=>{navigate("/settings")}} className="bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1 hover:bg-gray-200 col-span-1">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33h.09V3A2 2 0 0112 1a2 2 0 012 2v.09a1.65 1.65 0 001 1.51c.41.18.9.18 1.32 0a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001.51 1 1.65 1.65 0 00.33-1.82l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06z"/>
            </svg>
            Settings
          </button>
        </div>
      </div>
    </div>
    <Recent />
  </div>
)};

export default FarmerDashboard;
