import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { User, Mail, Lock, UserPlus, Sprout, Store, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function Signup() {
  const [role, setRole] = useState("vendor");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    let res = register({ ...formData, role });
    if(res.ok){
      toast.success("Register successfully!");
    }
    navigate("/login")
  };

  const roleIcon = {
    farmer: <Sprout className="w-5 h-5" />,
    vendor: <Store className="w-5 h-5" />,
    transporter: <Truck className="w-5 h-5" />,
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex flex-col md:flex-row items-center justify-center px-4 md:px-10 overflow-hidden">

      {/* Floating BG decor */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-300/40 blur-[80px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-200/40 blur-[90px] rounded-full"></div>

      {/* LEFT INTRO SECTION */}
      <div className="flex-1 max-w-xl hidden md:flex flex-col gap-5 pl-8 z-10">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-green-800 drop-shadow-xl leading-tight">
          Grow With The  
          <span className="text-green-600"> Green Network</span>
        </h1>

        <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
          A trusted platform for farmers, vendors, and transporters to connect,
          trade, and simplify agricultural logistics.
        </p>

        <div className="flex gap-3 mt-2 flex-wrap">
          <div className="px-4 py-2 bg-white/80 shadow-md backdrop-blur-lg rounded-xl border border-green-100 text-sm">
            🌱 Empowering Farmers
          </div>
          <div className="px-4 py-2 bg-white/80 shadow-md backdrop-blur-lg rounded-xl border border-green-100 text-sm">
            🛒 Vendor Marketplace
          </div>
          <div className="px-4 py-2 bg-white/80 shadow-md backdrop-blur-lg rounded-xl border border-green-100 text-sm">
            🚚 Smart Transport
          </div>
        </div>
      </div>

      {/* RIGHT FORM (COMPACT VERSION) */}
      <div className="flex-1 w-full max-w-md z-10">
        <div className="bg-white/90 backdrop-blur-xl p-6 md:p-7 rounded-2xl shadow-xl border border-green-100 animate-[fadeIn_0.7s_ease]">

          <h2 className="text-3xl font-extrabold text-green-800 text-center mb-1">
            Signup
          </h2>

          <p className="text-center text-gray-600 mb-6 text-sm">
            Create account as {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>

          {/* Compact Role Selector */}
          <div className="flex justify-between gap-2 mb-6">
            {["vendor","farmer", "transporter"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border flex flex-col items-center gap-1 transition-all
                ${
                  role === r
                    ? "bg-green-700 text-white border-green-700 shadow-md scale-[1.03]"
                    : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                }`}
              >
                <div className="hidden sm:block">{roleIcon[r]}</div>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Compact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2 text-sm mb-1">
                <User className="w-4 h-4 text-green-700" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/70 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2 text-sm mb-1">
                <Mail className="w-4 h-4 text-green-700" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/70 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2 text-sm mb-1">
                <Lock className="w-4 h-4 text-green-700" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/70 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-2 rounded-lg 
              text-sm font-semibold shadow-md hover:bg-green-800 active:scale-95 transition"
            >
              <UserPlus className="w-4 h-4" /> Signup
            </button>
          </form>

          <p className="mt-4 text-center text-gray-700 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
