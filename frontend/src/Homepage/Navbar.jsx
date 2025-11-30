import React, { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Leaf } from "lucide-react";

const AgriMarketNavbar = () => {
  const { AuthUser, logout } = useAuthStore();
  const navigate = useNavigate();

  // --- State ---
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Helpers ---
  const getBatteryColor = () => {
    if (battery === null) return "text-gray-400";
    if (battery > 50) return "text-green-500";
    if (battery > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const getBatteryIcon = () => {
    if (battery === null) return "🔋";
    return battery > 20 ? "🔋" : "🪫";
  };

  // --- Effects ---
  useEffect(() => {
    // 1. Clock
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 2. Battery (Safe Implementation)
    const loadBattery = async () => {
      if (navigator.getBattery) {
        try {
          const bat = await navigator.getBattery();
          const update = () => setBattery(Math.floor(bat.level * 100));
          update();
          bat.addEventListener("levelchange", update);
        } catch (e) { setBattery(null); }
      }
    };
    loadBattery();

    return () => clearInterval(timer);
  }, []);

  // Close menu on route change
  useEffect(() => setIsMobileMenuOpen(false), [navigate]);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedDate = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <>
      {/* --- Top Bar (Desktop) --- */}
      <div className="hidden lg:block bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
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

      {/* --- Main Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Agri<span className="text-emerald-600">Nova</span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home
              </Link>
              <Link to="/Product" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Marketplace
              </Link>
              <Link to="/About" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                About
              </Link>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => toast.success("No Notification")} className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              
              <div className="w-px h-8 bg-gray-300"></div>

              {AuthUser && (
                <div className="relative group">
                  <div onClick={() => navigate("/settings")} className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                      {AuthUser.profile_pic ? <img src={AuthUser.profile_pic} alt="User" className="w-full h-full object-cover" /> : AuthUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm text-gray-700 max-w-[100px] truncate">{AuthUser.name}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold overflow-hidden">
                        {AuthUser.profile_pic ? <img src={AuthUser.profile_pic} className="w-full h-full object-cover" /> : AuthUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{AuthUser.name}</div>
                        <div className="text-sm text-gray-500 truncate">{AuthUser.email}</div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button onClick={() => navigate("/settings")} className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                        My Profile
                      </button>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Toggle Buttons */}
            <div className="flex lg:hidden items-center gap-2">
              <button onClick={() => toast.success("No Notification")} className="p-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu Dropdown --- */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-2">
            
            {/* Search */}
            <form onSubmit={(e) => e.preventDefault()} className="relative mb-3">
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </form>

            <Link to="/" className="block px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-medium">Home</Link>
            <Link to="/Product" className="block px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-medium">Marketplace</Link>
            <Link to="/About" className="block px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-medium">About Us</Link>

            {AuthUser && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div onClick={() => navigate("/settings")} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {AuthUser.profile_pic ? <img src={AuthUser.profile_pic} className="w-full h-full object-cover" /> : AuthUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{AuthUser.name}</div>
                    <div className="text-sm text-gray-500 truncate">{AuthUser.email}</div>
                  </div>
                </div>
                <button onClick={() => navigate("/settings")} className="mt-2 w-full px-4 py-2 text-left text-gray-700 bg-white border border-gray-100 rounded-lg">Settings</button>
                <button onClick={logout} className="mt-2 w-full px-4 py-2 text-left text-red-600 bg-white border border-red-100 rounded-lg">Logout</button>
              </div>
            )}

            {/* Mobile Battery/Time */}
            <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <span>{formattedDate} • {formattedTime}</span>
              {battery !== null && <span className={getBatteryColor()}>{getBatteryIcon()} {battery}%</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </>
  );
};

export default AgriMarketNavbar;