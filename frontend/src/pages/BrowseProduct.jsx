// BrowseProduct.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../lib/store";
import { useNavigate } from "react-router-dom";

const BrowseProduct = () => {
  const { Allproduct, GetAllProduct } = useAuthStore();
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetAllProduct();
  }, []);

  useEffect(() => {
    setList(Allproduct || []);
  }, [Allproduct]);

  const filterProducts = (text) => {
    setSearch(text);
    if (!text.trim()) {
      setList(Allproduct);
      return;
    }
    const term = text.toLowerCase();
    setList(
      Allproduct.filter((p) =>
        `${p.Product_name} ${p.Product_description}`.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>
      
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Browse Products</h1>

      <input
        value={search}
        onChange={(e) => filterProducts(e.target.value)}
        placeholder="Search products..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 focus:ring-2 focus:ring-green-400 shadow-sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length === 0 && (
          <p className="text-gray-500 text-lg col-span-full text-center">
            No products found.
          </p>
        )}

        {list.map((p) => {
          const out = p.Product_status === "Out-Of-Stock";

          return (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="bg-white hover:cursor-pointer rounded-xl shadow p-4 hover:shadow-lg transition border"
            >
              <img
                src={p.Product_image}
                className="h-36 w-full object-cover rounded-lg mb-2"
                alt={p.Product_name}
              />

              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {p.Product_name}
              </h2>

              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {p.Product_description || "No description available"}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium mb-2 inline-block ${
                  out ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {p.Product_status}
              </span>

              <div className="flex justify-between items-center mt-1">
                <div>
                  {p.special_price ? (
                    <>
                      <p className="text-red-500 text-lg font-bold">
                        ₹{p.special_price}<span className="text-sm text-gray-600">/-  kg</span>
                      </p>
                      <p className="text-gray-500 line-through text-xs">
                        ₹{p.Product_price}/- kg
                      </p>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-green-600">
                      ₹{p.Product_price}<span className="text-sm text-gray-600 font-normal">/- kg</span>
                    </p>
                  )}
                </div>

                <button
                  disabled={out}
                  className={`px-4 py-1 rounded-lg text-sm shadow ${
                    out
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {out ? "Unavailable" : "View"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseProduct;