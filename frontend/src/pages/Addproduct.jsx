import React, { useState } from "react";
import { CiCamera, CiTrash } from "react-icons/ci";
import { useAuthStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProduct = ({ isSubmitting = false }) => {
  const [product, setProduct] = useState({
    Product_name: "",
    Product_price: "",
    Product_Qty: "",
    Product_location: "",
    location_pin: "",
    Product_description: "",
    Product_status: "In-Stock",
    Product_image: "",
  });
  const { AddProduct } = useAuthStore();
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProduct((prev) => ({ ...prev, Product_image: base64 }));
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewImage(null);
    setProduct((prev) => ({ ...prev, Product_image: "" }));
    document.getElementById("product-image").value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(Number(product.Product_Qty)<1){
      toast.error("Please enter valid quantity.")
      return;
    }
    if(Number(product.Product_Qty)<1){
      toast.error("Please enter valid Price.")
      return;
    }
    AddProduct({
      ...product,
      Product_price: Number(product.Product_price),
      Product_Qty: Number(product.Product_Qty),
    });
    navigate("/");
  };

  const isFormValid =
    product.Product_name &&
    product.Product_price &&
    product.Product_Qty &&
    product.Product_location &&
    product.location_pin.length === 6 &&
    product.Product_description.length >= 10 &&
    product.Product_image;

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      {/* Premium Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Add New Product
        </h1>
        <p className="text-gray-600 mt-2">
          Fill in the details to list your product
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-green-900 hover:text-green-700 font-medium mb-8 transition"
        >
        ⬅️ Back to Home
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>

        <div className="p-8">
          {/* Image Upload - Premium Style */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Image *
            </label>
            <div className="flex justify-center">
              {previewImage ? (
                <div className="relative group">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-64 h-64 object-cover rounded-2xl shadow-lg border-4 border-gray-100"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg"
                  >
                    <CiTrash size={22} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="product-image"
                  className="cursor-pointer w-64 h-64 border-4 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 transition-all duration-300 group"
                >
                  <CiCamera
                    size={48}
                    className="text-green-500 group-hover:text-green-600 mb-3"
                  />
                  <span className="text-green-700 font-medium">
                    Upload Image
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              )}
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="Product_name"
                  value={product.Product_name}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Organic Apples"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  required
                />
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ₹ Price (per kg)
                  </label>
                  <input
                    type="number"
                    name="Product_price"
                    value={product.Product_price}
                    onChange={handleChange}
                    placeholder="499"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity (in kg)
                  </label>
                  <input
                    type="number"
                    name="Product_Qty"
                    value={product.Product_Qty}
                    onChange={handleChange}
                    min="1"
                    placeholder="50"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City / Area *
                </label>
                <input
                  type="text"
                  name="Product_location"
                  value={product.Product_location}
                  onChange={handleChange}
                  placeholder="e.g. Andheri West, Mumbai"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="location_pin"
                  value={product.location_pin}
                  onChange={handleChange}
                  placeholder="400058"
                  maxLength="6"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description *
                </label>
                <span
                  className={`text-sm ${
                    product.Product_description.length > 190
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {product.Product_description.length}/200
                </span>
              </div>
              <textarea
                name="Product_description"
                value={product.Product_description}
                onChange={handleChange}
                rows={4}
                maxLength="200"
                placeholder="Describe your product (quality, freshness, benefits...)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Availability Status
              </label>
              <select
                name="Product_status"
                value={product.Product_status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
              >
                <option value="In-Stock">In Stock</option>
                <option value="Out-Of-Stock">Out of Stock</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                isSubmitting || !isFormValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Adding Product...</span>
                </>
              ) : (
                <span>Add Product</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
