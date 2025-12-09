import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft, FiEdit3, FiTrash2 } from "react-icons/fi";
import { useAuthStore } from "../lib/store";

const Inventory = () => {
  const { getproduct, userproduct, deleteProduct, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getproduct();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product) => {
    navigate(`/editProduct/${product}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-green-700">
          Loading your products...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-green-900 hover:text-green-700 font-medium mb-8 transition"
        >
          <FiArrowLeft className="mr-2 text-xl" /> Back to Home
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-900">
              My Inventory
            </h1>
            <p className="text-green-700 mt-1">
              {userproduct.length}{" "}
              {userproduct.length === 1 ? "product" : "products"} listed
            </p>
          </div>

          <button
            onClick={() => navigate("/addProduct")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2 transition-all hover:shadow-xl transform hover:-translate-y-1"
          >
            <FiPlus size={22} />
            Add New Product
          </button>
        </div>

        {/* Empty State */}
        {userproduct.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-20">🥬</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No products yet
            </h3>
            <p className="text-gray-600 mb-8">
              Start adding your fresh produce to the inventory!
            </p>
            <button
              onClick={() => navigate("/addProduct")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition"
            >
              <FiPlus className="inline mr-2" /> Add Your First Product
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {userproduct.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="aspect-w-1 aspect-h-1 h-56 overflow-hidden bg-gray-100">
                  <img
                    src={product.Product_image || "/placeholder.jpg"}
                    alt={product.Product_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
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

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {product.Product_name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">
                    {product.Product_description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {product.special_price && (
                        <span className="text-2xl font-bold text-green-700">
                          ₹{product.special_price}
                        </span>
                      )}
                      <span
                        className={`text-gray-500 ml-2 ${
                          product.special_price ? "line-through" : ""
                        }`}
                      >
                        ₹{product.Product_price}
                      </span>
                    </div>

                    <span className="text-sm text-gray-600">
                      {product.Product_Qty}{" "}
                      kg
                    </span>
                  </div>

                  {/* Location */}
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    📍 {product.Product_location}, {product.location_pin}
                  </p>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="bg-white p-4 rounded-full shadow-xl hover:bg-green-100 transition"
                    title="Edit"
                  >
                    <FiEdit3 size={22} className="text-green-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-white p-4 rounded-full shadow-xl hover:bg-red-100 transition"
                    title="Delete"
                  >
                    <FiTrash2 size={22} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
