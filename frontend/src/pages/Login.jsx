import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ ...formData });
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4">
      <div className="w-full max-w-sm backdrop-blur-md bg-white/80 p-8 rounded-3xl shadow-2xl border border-green-100 transform transition-all hover:shadow-green-200/50 hover:-translate-y-1">
        
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center text-green-800 drop-shadow-md mb-3">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Login to continue your journey 🌿
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
              <Mail className="w-5 h-5 text-green-700" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm bg-white/60 focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
              <Lock className="w-5 h-5 text-green-700" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm bg-white/60 focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-green-800 hover:shadow-green-800/40 transition-all active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>
        </form>

        {/* Signup */}
        <p className="mt-6 text-center text-gray-700">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-700 font-semibold hover:text-green-900 hover:underline transition"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
