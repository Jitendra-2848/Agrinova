// DashboardMain.jsx
import React from 'react';
import RecentActivity from './Recent';
import AgriMarketNavbar from './Navbar';
import { useNavigate } from 'react-router-dom';
const DashboardMain =()=>{
  const navigate = useNavigate()
  const userName = "Mike";
  const initial = 'M';
  const activeDeliveries = 15;
  const totalDistance = 2450;
  const completedJobs = 342;
  const earnings = 8920;
 return (
  <div>
    {/* Navbar */}
    {/* <nav className="bg-emerald-600 h-[90px] flex items-center px-8 w-full shadow-md justify-between">
      <div className="flex items-center w-full">
        <span className="text-3xl text-white ml-10 mr-3">🌱</span>
        <span className="font-bold text-2xl text-white tracking-wide mr-10">AgriNova</span>
        <ul className="flex gap-7 list-none ml-20">
          <li>
            <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Home</a>
          </li>
          <li>
            <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Marketplace</a>
          </li>
          <li>
            <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Analytics</a>
          </li>
          <li>
            <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Notifications</a>
          </li>
        </ul>
      </div>
      <div className="flex items-center bg-emerald-400 rounded-full min-w-60 px-4 py-1">
        <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center font-bold text-emerald-600 text-lg shadow mr-3">
          {initial}
        </div>
        <div className="flex flex-col text-white leading-tight">
          <span className="font-semibold text-base mb-1">{userName}</span>
          <span className="text-sm opacity-90">user.123@agrimarket.com</span>
        </div>
      </div>
    </nav> */}
    <AgriMarketNavbar />
    
    {/* Main Dashboard */}
    <div className="bg-blue-50 min-h-screen pt-6 px-6">
      {/* Welcome Box */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! <span className="inline-block">👋</span>
          </div>
          <div className="text-gray-600 text-lg">You have {activeDeliveries} active deliveries today. Stay safe on the road!</div>
        </div>
        <div>
          <button className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-orange-600 transition">
            Transporter
          </button>
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9V7a4 4 0 014-4h10a4 4 0 014 4v2"></path>
              <rect x="3" y="10" width="18" height="11" rx="2"></rect>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{activeDeliveries}</div>
          <div className="text-gray-500 text-base mt-2">Active Deliveries</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2v20m0 0l-7-7m7 7l7-7"></path>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalDistance} km</div>
          <div className="text-gray-500 text-base mt-2">Total Distance</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-yellow-100 p-3 rounded-full mb-3">
            <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{completedJobs}</div>
          <div className="text-gray-500 text-base mt-2">Completed Jobs</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-purple-100 p-3 rounded-full mb-3">
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v8m0 4v2m6-2v2M6 20v2"></path>
              <rect x="6" y="2" width="12" height="16" rx="3"></rect>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">${earnings.toLocaleString()}</div>
          <div className="text-gray-500 text-base mt-2">Earnings</div>
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
        <div className="grid grid-cols-4 gap-4">
          <button onClick={()=>{navigate("/transport")}} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-xl">+</span>
            Accept New Job
          </button>
          <button onClick={()=>{navigate("/delivery_update")}}  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-4 rounded-lg shadow flex flex-col items-center">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17l4-4-4-4m5 4h10"></path></svg>
            Update Delivery
          </button>
          <button  onClick={()=>{navigate("/Active_delivery")}}   className="bg-gray-200 text-gray-800 font-semibold py-4 px-4 rounded-lg shadow flex flex-col items-center hover:bg-gray-300">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 7v6a2 2 0 01-2 2"></path></svg>
            Active Jobs
          </button>
          <button  onClick={()=>{navigate("/delivery_history")}}   className="bg-gray-200 text-gray-800 font-semibold py-4 px-4 rounded-lg shadow flex flex-col items-center hover:bg-gray-300">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 10v12"></path></svg>
            Delivery History
          </button>
        </div>
      </div>
    </div>
    <RecentActivity />
  </div>
 );
}

export default DashboardMain;
