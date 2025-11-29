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
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    selectedproduct(id);
  }, [id]);

  // FIXED: Now correctly uses product_data from your store
  useEffect(() => {
    if (product_data) {
      setProduct(product_data);
      setPreviewImage(product_data.Product_image || "/placeholder.jpg");
    }
  }, [product_data]); // ← This was the main bug (was watching selectedproduct before)

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
      setPreviewImage(base64);
      setProduct((prev) => ({ ...prev, Product_image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      Product_id:id,
      Product_name: product.Product_name,
      Product_price: Number(product.Product_price),
      Product_Qty: Number(product.Product_Qty),
      Product_location: product.Product_location,
      location_pin: product.location_pin,
      Product_description: product.Product_description,
      Product_status: product.Product_status,
      special_price: Number(product.special_price) || null,
      Product_image: product.Product_image,
    };

    try {
      await updateProduct(updatedData);
      toast.success("Product updated successfully!");
      navigate("/manage");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-green-700">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/manage")}
          className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-8 transition"
        >
          <FiArrowLeft className="mr-2 text-xl" /> Back to Inventory
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">
            Edit Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Product"
                  className="w-64 h-64 object-cover rounded-2xl shadow-lg border-4 border-gray-100"
                />
                <label
                  htmlFor="edit-image"
                  className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full cursor-pointer shadow-xl transition"
                >
                  <FiCamera size={24} />
                </label>
                <input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="Product_name" value={product.Product_name || ""} onChange={handleChange} placeholder="Product Name" className="px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition text-lg" required />
              <input type="number" name="Product_price" value={product.Product_price || ""} onChange={handleChange} placeholder="Price (₹)" className="px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition text-lg" required />
              <input type="number" name="Product_Qty" value={product.Product_Qty || ""} onChange={handleChange} placeholder="Quantity" className="px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition text-lg" required />
              <input type="text" name="Product_location" value={product.Product_location || ""} onChange={handleChange} placeholder="Location" className="px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition text-lg" required />
              <input type="text" name="location_pin" value={product.location_pin || ""} onChange={handleChange} placeholder="PIN Code" maxLength="6" className="px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition text-lg" required />
              <input type="text" name="special_price" value={product.special_price || ""} onChange={handleChange} placeholder="Special Price (optional)" className="px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition text-lg" />
            </div>

            <textarea
              name="Product_description"
              value={product.Product_description || ""}
              onChange={handleChange}
              rows={4}
              maxLength="200"
              placeholder="Description (max 200 chars)"
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition resize-none"
              required
            />

            <div className="flex gap-4">
              <select
                name="Product_status"
                value={product.Product_status || "In-Stock"}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition text-lg"
              >
                <option value="In-Stock">In Stock</option>
                <option value="Out-Of-Stock">Out of Stock</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;