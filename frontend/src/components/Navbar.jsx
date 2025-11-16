import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    } else {
      toast.error("Please enter something to search!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-green-800 px-6 py-3 text-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        AgriNova
      </div>

      {/* Search Box */}
      <form
        onSubmit={handleSearch}
        className="flex w-full items-center gap-2 mt-2 sm:mt-0 sm:w-auto order-2 sm:order-none"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-3/4 sm:w-56 rounded-md border-none px-3 py-2 text-black focus:outline-white bg-white"
        />
        <button
          type="submit"
          className="w-1/4 sm:w-auto rounded-md bg-blue-900 px-4 py-2 font-semibold text-white hover:bg-black transition-all"
        >
          Search
        </button>
      </form>

      {/* Nav Links */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute right-6 top-14 w-40 flex-col rounded-md bg-green-900 sm:static sm:flex sm:flex-row sm:space-x-6 sm:bg-transparent sm:w-auto`}
      >
        {isLoggedIn ? (
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="px-3 py-2 text-white hover:text-green-200 transition-all"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-white hover:text-green-200 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-white hover:text-green-200 transition-all"
            >
              Signup
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Button */}
      <div
        className="flex flex-col space-y-1 cursor-pointer sm:hidden"
        onClick={toggleMenu}
      >
        <span
          className={`block h-1 w-6 bg-white transition-all ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block h-1 w-6 bg-white transition-all ${
            isOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block h-1 w-6 bg-white transition-all ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </div>
    </nav>
  );
}
