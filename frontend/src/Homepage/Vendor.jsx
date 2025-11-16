// BuyerDashboard.jsx
import React from 'react';
import RecentActivity from './VeRecent.jsx'
import AgriMarketNavbar from './Navbar.jsx';
import { useNavigate } from 'react-router-dom';
const BuyerDashboard =()=>{
  const userName = "Sarah";
  const initial = "SJ";
  const activeOrders = 8;
  const totalPurchases = 156;
  const wishlistItems = 23;
  const totalSpent = 12340;
  const navigate = useNavigate()
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

    {/* Dashboard Main */}
    <div className="bg-blue-50 min-h-screen pt-6 px-6">
      {/* Welcome Box */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! <span className="inline-block">👋</span>
          </div>
          <div className="text-gray-600 text-md">Discover fresh products from local farmers today.</div>
        </div>
        <div>
          <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition">
            BUYER
          </button>
        </div>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            {/* Cart SVG */}
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 6h15l-1.5 9h-13z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{activeOrders}</div>
          <div className="text-gray-500 text-base mt-2">Active Orders</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            {/* Bag/Package SVG */}
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M16 10V8a4 4 0 00-8 0v2" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalPurchases}</div>
          <div className="text-gray-500 text-base mt-2">Total Purchases</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-orange-100 p-3 rounded-full mb-3">
            {/* Heart SVG */}
            <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 21C12 21 7 16.28 4 13.23C1.83 11.05 2.13 7.4 4.71 5.99C7.04 4.74 9.77 6.39 12 9.13C14.23 6.39 16.97 4.74 19.29 5.99C21.87 7.4 22.17 11.05 20 13.23C17 16.28 12 21 12 21Z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">{wishlistItems}</div>
          <div className="text-gray-500 text-base mt-2">Wishlist Items</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="bg-purple-100 p-3 rounded-full mb-3">
            {/* Credit Card/Spent SVG */}
            <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20" />
              <circle cx="7" cy="15" r="1" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">${totalSpent.toLocaleString()}</div>
          <div className="text-gray-500 text-base mt-2">Total Spent</div>
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
          {/* Browse Products */}
          <button onClick={()=>{navigate("/Product")}} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Browse Products
          </button>
          {/* My Orders */}
          <button  onClick={()=>{navigate("/MyOrder")}}  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M16 10V8a4 4 0 00-8 0v2" />
            </svg>
            My Orders
          </button>
          {/* Wishlist */}
          {/* Favorite Sellers */}
          <button  onClick={()=>{navigate("/Product")}}  className="bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1 hover:bg-gray-200">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 17.75L7.12 20.52L8.27 15.02L4.55 11.24L10.04 10.62L12 5.5L13.96 10.62L19.45 11.24L15.73 15.02L16.88 20.52L12 17.75Z" />
            </svg>
            Favorite Sellers
          </button>
          {/* Track Delivery */}
          <button  onClick={()=>{navigate("/track")}}  className="bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg shadow flex flex-col items-center gap-1 hover:bg-gray-200">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h3v8a2 2 0 01-2 2h-7" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
            Track Delivery
          </button>
        </div>
      </div>
    </div>
    <RecentActivity />
  </div>
)};

export default BuyerDashboard;
