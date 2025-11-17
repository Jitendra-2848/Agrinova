import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const Product = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();

  const { selectedproduct, product_data, GetAllProduct, Allproduct } =
    useAuthStore();

  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch product + all products
  useEffect(() => {
    GetAllProduct();
    selectedproduct(product_id);
  }, [product_id]);

  // When product loads, set to local state
  useEffect(() => {
    if (product_data) {
      setProduct(product_data);
    }
  }, [product_data]);

  // Build suggestion list (other products)
  useEffect(() => {
    if (Allproduct && product_id) {
      const filtered = Allproduct.filter((item) => item._id !== product_id);
      setSuggestions(filtered);
    }
  }, [Allproduct, product_id]);

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg mb-4 font-medium"
      >
        ← Back
      </button>

      {/* MAIN PRODUCT CARD */}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* IMAGE */}
          <div className="w-full md:w-1/2">
            <img
              src={product.Product_image}
              alt={product.Product_name}
              className="rounded-xl w-full h-80 object-cover bg-gray-200"
            />
          </div>

          {/* DETAILS */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">{product.Product_name}</h2>

            <p className="text-gray-600">{product.Product_description}</p>

            <p className="text-xl font-bold text-green-600">
              ₹{product.Product_price}
            </p>

            {product.special_price && (
              <p className="text-lg text-red-500">
                Special Price: ₹{product.special_price}
              </p>
            )}

            <p
              className={`font-semibold ${
                product.Product_status === "Out-Of-Stock"
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              Status: {product.Product_status}
            </p>

            {/* BUY NOW */}
            <button
              onClick={() => navigate("/Buy")}
              className="bg-[#078a33] hover:bg-[#17c53c] text-green-100 font-semibold py-2 rounded-xl shadow-md"
            >
              Buy Now
            </button>

            {/* BARGAIN */}
            <button
              onClick={() => navigate("/msg")}
              className="bg-cyan-600 hover:bg-teal-700 font-semibold text-green-50 py-2 rounded-xl shadow-md"
            >
              Bargain with Seller
            </button>
          </div>
        </div>
      </div>

      {/* REAL SUGGESTIONS */}
      <div className="mt-8 max-w-[80%] mx-auto">
        <h3 className="text-xl font-semibold mb-3">Similar Products</h3>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {suggestions.length === 0 ? (
            <p>No similar products available.</p>
          ) : (
            suggestions.map((item) => (
              <div
                key={item._id}
                className="w-[250px] bg-white p-4 rounded-xl shadow-md cursor-pointer hover:scale-105 transition"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img
                  src={item.Product_image}
                  className="h-28 w-full object-cover rounded-lg mb-2 bg-gray-200"
                  alt={item.Product_name}
                />

                <p className="font-semibold truncate">{item.Product_name}</p>
                <p className="text-green-600 font-bold">₹{item.Product_price}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
