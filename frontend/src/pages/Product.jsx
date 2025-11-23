import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiPackage,
  FiMessageCircle,
} from "react-icons/fi";
import { useAuthStore } from "../lib/store";

const Product = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const {
    selectedproduct,
    product_data,
    GetAllProduct,
    Allproduct,
    setBuyProduct,
    Authtype
  } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    GetAllProduct();
    selectedproduct(product_id);
  }, [product_id]);

  useEffect(() => {
    if (product_data) {
      setProduct(product_data);
    }
  }, [product_data]);

  useEffect(() => {
    if (Allproduct && product_id) {
      const filtered = Allproduct.filter(
        (item) => item._id !== product_id
      ).slice(0, 8);
      setSuggestions(filtered);
    }
  }, [Allproduct, product_id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-green-800">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-green-800 hover:text-green-600 font-semibold mb-8 transition-all hover:gap-4"
        >
          <FiArrowLeft size={24} />
          Back
        </button>

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative overflow-hidden bg-gray-100">
              <img
                src={product.Product_image || "/placeholder.jpg"}
                alt={product.Product_name}
                className="w-full h-96 lg:h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div
                className={`absolute top-4 left-4 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg ${
                  product.Product_status === "In-Stock"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {product.Product_status === "In-Stock"
                  ? "In Stock"
                  : "Out of Stock"}
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {product.Product_name}
                </h1>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FiMapPin size={20} className="text-green-600" />
                  <span className="font-medium">
                    {product.Product_location}, {product.location_pin}
                  </span>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {product.Product_description}
                </p>

                <div className="mb-8">
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-bold text-green-600">
                      ₹{product.Product_price}
                    </span>
                    {product.special_price && (
                      <span className="text-2xl text-gray-500 line-through">
                        ₹{product.special_price}
                      </span>
                    )}
                  </div>
                  {product.special_price && (
                    <p className="text-green-600 font-semibold mt-2">
                      Special Discount Applied!
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-8 text-gray-700">
                  <FiPackage size={22} />
                  <span className="font-semibold">
                    Available Quantity:{" "}
                    <span className={product.Product_Qty ? `text-green-600` : `text-red-600`}>
                      {product.Product_Qty} units
                    </span>
                  </span>
                </div>

                {/* Action Buttons */}
                {
                  Authtype == "vendor" && 
                  Number(product.Product_Qty) > 0 && 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setBuyProduct(product);
                      navigate("/buy");
                    }}
                    disabled={product.Product_status !== "In-Stock"}
                    className={`py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      product.Product_status === "In-Stock"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => navigate("/msg")}
                    className="py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-xl flex items-center justify-center gap-3 transition-all hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <FiMessageCircle size={24} />
                    Bargain with Seller
                  </button>
                </div>
                  }
                  {
                    Number(product.Product_Qty) <= 0 && 
                    <div>
                      <p className="text-red-600 font-semibold text-lg font-masti">Sorry,We are out of stock.</p>
                    </div>
                  }
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Similar Products Near You
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={item.Product_image}
                    alt={item.Product_name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 truncate">
                      {item.Product_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {item.Product_location}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{item.Product_price}
                      </span>
                      {item.Product_status === "In-Stock" ? (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                          Out
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
