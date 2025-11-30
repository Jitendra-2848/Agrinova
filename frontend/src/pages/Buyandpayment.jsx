import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiCheck,
  FiTag,
} from "react-icons/fi";

const Buy = () => {
  const navigate = useNavigate();
  const {
    buy_product,
    negotiated_deal,
    Buy,
    Tracking_id,
    RemoveBuy,
    clearNegotiatedDeal,
    AuthUser,
  } = useAuthStore();

  // Determine if using a negotiated deal or standard buy
  const isNegotiated = !!(negotiated_deal && negotiated_deal.product);
  const product = isNegotiated ? negotiated_deal.product : buy_product;

  // State
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize quantity from negotiated deal
  useEffect(() => {
    if (isNegotiated && negotiated_deal?.quantity) {
      setQuantity(Number(negotiated_deal.quantity) || 1);
    }
  }, [isNegotiated, negotiated_deal]);

  // Safe number helpers
  const safeNumber = (val, fallback = 0) => {
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  // Derived values with safe calculations
  const originalPrice = safeNumber(product?.Product_price, 0);
  const negotiatedPrice = isNegotiated
    ? safeNumber(negotiated_deal?.negotiatedPrice, originalPrice)
    : originalPrice;
  const currentPrice = isNegotiated ? negotiatedPrice : originalPrice;
  const currentQty = isNegotiated
    ? safeNumber(negotiated_deal?.quantity, 1)
    : safeNumber(quantity, 1);
  const maxQty = safeNumber(product?.Product_Qty, 1);

  // Calculations with safe math
  const subtotal = safeNumber(currentPrice * currentQty, 0);
  const deliveryCharge = 150;
  const discount = isNegotiated
    ? safeNumber((originalPrice - currentPrice) * currentQty, 0)
    : 0;
  const totalAmount = safeNumber(subtotal + deliveryCharge, 0);

  // Calculate discount percentage safely
  const discountPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  // Redirect if no product found
  useEffect(() => {
    if (!product) {
      toast.error("No product selected");
      navigate("/product");
    }
  }, [product, navigate]);

  // Handle Success
  useEffect(() => {
    if (Tracking_id) {
      toast.success("Order placed successfully!");
      if (isNegotiated && clearNegotiatedDeal) {
        clearNegotiatedDeal();
      }
      RemoveBuy();
      navigate(`/track?tracking_id=${Tracking_id}`);
    }
  }, [Tracking_id, navigate, isNegotiated, clearNegotiatedDeal, RemoveBuy]);

  const handleQuantityChange = (delta) => {
    if (isNegotiated) return; // Lock quantity for negotiated deals
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= maxQty) {
      setQuantity(newQty);
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      return toast.error("Please enter delivery address");
    }
    if (deliveryPincode.length !== 6) {
      return toast.error("Please enter valid 6-digit pincode");
    }
    if (!product?._id) {
      return toast.error("Product information missing");
    }

    setIsProcessing(true);
    try {
      const orderData = {
        productid: product._id,
        quantity: currentQty,
        status: "pending",
        delivery: {
          address: deliveryAddress,
          pincode: deliveryPincode,
          charge: deliveryCharge,
        },
        payment: {
          method: paymentMethod,
          amount: totalAmount,
          discount: discount,
          isNegotiated: isNegotiated,
          negotiatedPrice: isNegotiated ? currentPrice : null,
          originalPrice: originalPrice,
        },
        // Additional info for backend
        buyerId: AuthUser?._id,
        farmerId: product?.userId,
      };

      console.log("Placing order:", orderData);
      await Buy(orderData);
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    RemoveBuy();
    if (isNegotiated && clearNegotiatedDeal) {
      clearNegotiatedDeal();
    }
    navigate(-1);
  };

  // Loading state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-6 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-3 text-green-800 hover:text-green-600 font-semibold mb-8 transition-all hover:gap-4"
        >
          <FiArrowLeft size={24} /> Back
        </button>

        {/* Negotiated Deal Banner */}
        {isNegotiated && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FiTag size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl">🎉 Negotiated Deal Applied!</h3>
                <p className="text-emerald-100 mt-1">
                  You're getting a special price of{" "}
                  <span className="font-bold text-white">₹{currentPrice}/unit</span>{" "}
                  instead of ₹{originalPrice}
                </p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl text-center">
                <p className="text-2xl font-bold">{discountPercent}%</p>
                <p className="text-xs">OFF</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Order Summary */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Product Card */}
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
              <img
                src={product.Product_image || "/placeholder.jpg"}
                alt={product.Product_name}
                className="w-24 h-24 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                  {product.Product_name}
                </h3>
                {product.Product_location && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <FiMapPin size={14} />
                    <span>{product.Product_location}</span>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{currentPrice}
                  </span>
                  {isNegotiated && currentPrice !== originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{originalPrice}
                      </span>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Control */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700 text-lg">
                  Quantity
                </span>
                {isNegotiated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      {currentQty}
                    </span>
                    <span className="text-gray-500">units</span>
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full ml-2">
                      Fixed (Negotiated)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-bold text-xl">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQty}
                      className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FiPackage className="text-emerald-600" />
                {maxQty} units available in stock
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>
                  Price ({currentQty} × ₹{currentPrice})
                </span>
                <span className="font-medium">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-2">
                    <FiTag size={16} />
                    Negotiation Savings
                  </span>
                  <span className="font-bold">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <FiTruck size={16} />
                  Delivery Charges
                </span>
                <span className="font-medium">₹{deliveryCharge}</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span className="text-emerald-600">₹{totalAmount}</span>
              </div>

              {discount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-green-700 font-semibold">
                    🎉 You're saving ₹{discount} on this order!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Delivery & Payment */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="text-emerald-600" /> Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete address including house/flat number, street, landmark..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={deliveryPincode}
                    onChange={(e) =>
                      setDeliveryPincode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {deliveryPincode.length > 0 &&
                    deliveryPincode.length !== 6 && (
                      <p className="text-red-500 text-sm mt-1">
                        Pincode must be 6 digits
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-emerald-600" /> Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: "cod",
                    name: "Cash on Delivery",
                    desc: "Pay when you receive your order",
                    icon: "💵",
                  },
                  {
                    id: "online",
                    name: "Online Payment",
                    desc: "UPI / Card / Net Banking",
                    icon: "💳",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        paymentMethod === method.id
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      )}
                    </div>
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={
                isProcessing ||
                !deliveryAddress.trim() ||
                deliveryPincode.length !== 6
              }
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck size={24} />
                  Place Order - ₹{totalAmount}
                </>
              )}
            </button>

            {/* Security Note */}
            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <FiCheck className="text-green-500" />
              Your payment is 100% secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;