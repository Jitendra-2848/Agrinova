// EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCamera } from "react-icons/fi";
import { useAuthStore } from "../lib/store";
import { toast } from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedproduct, product_data, updateProduct, loading } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState("/placeholder.jpg");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product when id changes
  useEffect(() => {
    if (id) {
      selectedproduct(id);
    }
  }, [id, selectedproduct]);

  // Set local state from store data
  useEffect(() => {
    if (product_data) {
      setProduct(product_data);
      setPreviewImage(product_data.Product_image || "/placeholder.jpg");
    }
  }, [product_data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For numeric inputs so "0" is allowed and we can still clear the field
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setPreviewImage(base64);
      setProduct((prev) => ({ ...prev, Product_image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    const updatedData = {
      Product_id: id,
      Product_name: product.Product_name?.trim(),
      Product_price: Number(product.Product_price) || 0,
      Product_Qty: Number(product.Product_Qty) || 0,
      Product_location: product.Product_location?.trim(),
      location_pin: product.location_pin?.trim(),
      Product_description: product.Product_description?.trim(),
      Product_status: product.Product_status || "In-Stock",
      special_price:
        product.special_price === "" || product.special_price == null
          ? null
          : Number(product.special_price),
      Product_image: product.Product_image,
    };

    try {
      setIsSubmitting(true);
      await updateProduct(updatedData);
      toast.success("Product updated successfully!");
      navigate("/manage");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-lg">
          <p className="text-xl font-semibold text-green-900">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/manage")}
          className="mb-6 inline-flex items-center text-sm font-medium text-green-900 hover:text-green-700 transition-colors"
        >
          <FiArrowLeft className="mr-2 text-lg" />
          Back to inventory
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-50 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-100 px-6 py-5 md:px-10 md:py-7 bg-gradient-to-r from-emerald-50 to-green-50">
            <h1 className="text-2xl md:text-3xl font-bold text-green-900">
              Edit product
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update product information, pricing, stock and image.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 md:px-10 md:py-8 space-y-8"
          >
            {/* Image section */}
            <section aria-label="Product image" className="flex justify-center">
              <div className="relative">
                <img
                  src={previewImage}
                  alt={product.Product_name || "Product image"}
                  className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-2xl shadow-lg border-4 border-white outline outline-1 outline-emerald-100"
                />
                <label
                  htmlFor="edit-image"
                  className="absolute bottom-3 right-3 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full cursor-pointer shadow-xl transition-colors"
                >
                  <FiCamera size={22} />
                </label>
                <input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </section>

            {/* Basic information */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Basic information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label
                    htmlFor="Product_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product name
                  </label>
                  <input
                    id="Product_name"
                    type="text"
                    name="Product_name"
                    value={product.Product_name ?? ""}
                    onChange={handleChange}
                    placeholder="e.g. Organic Fresh Apples"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="Product_status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="Product_status"
                    name="Product_status"
                    value={product.Product_status ?? "In-Stock"}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base bg-white"
                  >
                    <option value="In-Stock">In stock</option>
                    <option value="Out-Of-Stock">Out of stock</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Pricing & stock */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Pricing & stock
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label
                    htmlFor="Product_price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ₹Price (per kg)
                  </label>
                  <input
                    id="Product_price"
                    type="number"
                    name="Product_price"
                    value={product.Product_price ?? ""}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="special_price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Special price (optional)
                  </label>
                  <input
                    id="special_price"
                    type="number"
                    name="special_price"
                    value={product.special_price ?? ""}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    placeholder="Discounted price"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="Product_Qty"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity(kg) in stock
                  </label>
                  <input
                    id="Product_Qty"
                    type="number"
                    name="Product_Qty"
                    value={product.Product_Qty ?? ""}
                    onChange={handleNumberChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-1">
                  <label
                    htmlFor="Product_location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    id="Product_location"
                    type="text"
                    name="Product_location"
                    value={product.Product_location ?? ""}
                    onChange={handleChange}
                    placeholder="City, area or warehouse"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="location_pin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PIN code
                  </label>
                  <input
                    id="location_pin"
                    type="text"
                    name="location_pin"
                    value={product.location_pin ?? ""}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-1">
              <label
                htmlFor="Product_description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="Product_description"
                name="Product_description"
                value={product.Product_description ?? ""}
                onChange={handleChange}
                rows={4}
                maxLength={200}
                placeholder="Describe the product (max 200 characters)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm md:text-base resize-none"
                required
              />
              <p className="text-xs text-gray-400 text-right">
                {product.Product_description?.length || 0}/200 characters
              </p>
            </section>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/manage")}
                className="w-full md:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg
                  bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                  disabled:opacity-60 disabled:cursor-not-allowed transition-transform transition-colors
                  ${isSubmitting ? "" : "hover:-translate-y-0.5"}`}
              >
                {isSubmitting ? "Updating..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;