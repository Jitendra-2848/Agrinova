import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiMessageCircle,
  FiTruck,
  FiShield,
  FiCheck,
} from "react-icons/fi";
import { ShoppingBag } from "lucide-react";
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
    Authtype,
    setNegotiationProduct,
  } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    GetAllProduct();
    selectedproduct(product_id);
  }, [product_id]);

  useEffect(() => {
    if (product_data) setProduct(product_data);
  }, [product_data]);

  useEffect(() => {
    if (Allproduct && product_id) {
      const filtered = Allproduct.filter((item) => item._id !== product_id).slice(0, 8);
      setSuggestions(filtered);
    }
  }, [Allproduct, product_id]);

  const handleBargainClick = () => {
    if (!product?.userId) return;
    setNegotiationProduct(product);
    navigate(`/chat?farmer=${product.userId}&product=${product._id}`);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Back Button */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium"
          >
            <FiArrowLeft size={22} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Product Image - Only One */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <img
              src={product.Product_image || "/placeholder.jpg"}
              alt={product.Product_name}
              className="w-full h-96 lg:h-screen object-cover hover:scale-105 transition-transform duration-500"
            />
            
            {/* Stock Status Badge */}
            <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg ${
              product.Product_Qty > 0 ? "bg-emerald-600" : "bg-red-600"
            }`}>
              {product.Product_Qty > 0 ? "In Stock" : "Out of Stock"}
            </div>

            {/* Low Stock Warning */}
            {product.Product_Qty > 0 && product.Product_Qty <= 10 && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Only {product.Product_Qty} left!
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {product.Product_name}
            </h1>

            {/* Price Section - Clean & Real */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                {product.special_price ? (
                  <>
                    <span className="text-5xl font-bold text-emerald-600">
                      ₹{product.special_price}
                    </span>
                    <span className="text-3xl text-gray-400 line-through">
                      ₹{product.Product_price}
                    </span>
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-lg">
                      {Math.round(((product.Product_price - product.special_price) / product.Product_price) * 100)}% OFF
                    </div>
                  </>
                ) : (
                  <span className="text-5xl font-bold text-emerald-600">
                    ₹{product.Product_price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-green-600 font-medium">
                <FiCheck size={20} />
                Inclusive of all taxes
              </div>
            </div>

            {/* Stock Info */}
            <div className="flex items-center gap-4 text-lg">
              <FiPackage className="text-emerald-600" />
              <span className="font-medium">
                Available: <span className="font-bold text-emerald-600">{product.Product_Qty} units</span>
              </span>
              {product.Product_Qty <= 10 && product.Product_Qty > 0 && (
                <span className="ml-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                  Hurry! Low stock
                </span>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FiShield className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-600">100% Genuine</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-600">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-600">Easy Returns</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-3">About this product</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.Product_description || "High-quality product directly from the source."}
              </p>
            </div>

            {/* Action Buttons */}
            {Authtype === "vendor" && product.Product_Qty > 0 && (
              <div className="flex flex-col sm:flex-row  gap-4 pt-4">
                <button
                  onClick={() => {
                    setBuyProduct(product);
                    navigate("/buy");
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingBag size={24} />
                  Buy Now
                </button>

                <button
                  onClick={handleBargainClick}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <FiMessageCircle size={24} />
                  Bargain with Seller
                </button>
              </div>
            )}

            {/* Out of Stock */}
            {product.Product_Qty <= 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-10 text-center">
                <p className="text-4xl font-bold text-red-600 mb-3">Out of Stock</p>
                <p className="text-xl text-gray-700">This item is currently unavailable</p>
                <p className="text-gray-600 mt-3">Check back later or see similar products below</p>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {suggestions.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all group"
                >
                  <img
                    src={item.Product_image}
                    alt={item.Product_name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{item.Product_name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      {item.special_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-emerald-600">₹{item.special_price}</span>
                          <span className="text-sm text-gray-400 line-through">₹{item.Product_price}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-emerald-600">₹{item.Product_price}</span>
                      )}
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        item.Product_Qty > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {item.Product_Qty > 0 ? "In Stock" : "Out"}
                      </span>
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