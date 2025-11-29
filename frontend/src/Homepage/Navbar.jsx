// AgriMarketNavbar.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const AgriMarketNavbar = () => {
  const { AuthUser, logout } = useAuthStore();
  const navigate = useNavigate();

  // State
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Battery color based on level
  const getBatteryColor = () => {
    if (!battery) return "text-gray-400";
    if (battery > 50) return "text-green-500";
    if (battery > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const getBatteryIcon = () => {
    if (!battery) return "🔋";
    if (battery > 80) return "🔋";
    if (battery > 50) return "🔋";
    if (battery > 20) return "🪫";
    return "🪫";
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    if ("getBattery" in navigator) {
      navigator.getBattery().then((bat) => {
        const updateBattery = () => setBattery(Math.floor(bat.level * 100));
        updateBattery();
        bat.addEventListener("levelchange", updateBattery);
      });
    }

    return () => clearInterval(timer);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Top System Bar - Desktop Only */}
      <div className="hidden lg:block bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                India
              </span>
              <span className="text-emerald-100">|</span>
              <span>Support: +91 1800-XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">{formattedDate}</span>
              <span className="text-emerald-100">•</span>
              <span className="font-mono font-semibold">{formattedTime}</span>
              {battery !== null && (
                <>
                  <span className="text-emerald-100">•</span>
                  <span className={`flex items-center gap-1 ${getBatteryColor()}`}>
                    {getBatteryIcon()} {battery}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900 tracking-tight">
                  AgriNova
                </span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold -mt-0.5 hidden sm:block">
                  Smart Farming
                </span>
              </div>
            </div>

            {/* Center: Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { to: "/", label: "Home", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
                { to: "/Product", label: "Marketplace", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
                { to: "/About", label: "About", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium text-sm"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: Notifications, Profile - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => toast.success("No Notification")}
                className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              <div className="w-px h-8 bg-gray-300"></div>

              {AuthUser && (
                <div className="relative group">
                  <div
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                        {AuthUser.profile_pic ? (
                          <img src={AuthUser.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          AuthUser.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <span className="font-medium text-sm text-gray-700 max-w-[100px] truncate">
                      {AuthUser.name}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown on Hover */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold overflow-hidden">
                          {AuthUser.profile_pic ? (
                            <img src={AuthUser.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            AuthUser.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{AuthUser.name}</div>
                          <div className="text-sm text-gray-500 truncate">{AuthUser.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - FIXED */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Notification */}
              <button
                onClick={() => toast.success("No notification yet.")}
                className="relative p-2 text-gray-600 hover:text-emerald-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* HAMBURGER BUTTON - FIXED: Added onClick */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - FIXED */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-2">
            {/* Mobile Search */}
            {/* Mobile User Section */}
            {AuthUser && (
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                <div
                  onClick={() => {
                    navigate("/settings");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-emerald-300 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                      {AuthUser.profile_pic ? (
                        <img src={AuthUser.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        AuthUser.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{AuthUser.name}</div>
                    <div className="text-sm text-gray-500 truncate">{AuthUser.email}</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Settings Button */}
                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors font-medium bg-white border border-gray-100"
                >
                  Settings
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium bg-white border border-red-100"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile System Info */}
            <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 px-2">
              <span>{formattedDate} • {formattedTime}</span>
              {battery !== null && (
                <span className={getBatteryColor()}>
                  {getBatteryIcon()} {battery}%
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AgriMarketNavbar;