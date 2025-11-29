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
    AuthUser,
    Buy,
    Tracking_id,
    RemoveBuy,
    clearNegotiatedDeal,
  } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // Use negotiated deal if available
  const isNegotiatedPurchase = negotiated_deal !== null;
  const product = isNegotiatedPurchase ? negotiated_deal.product : buy_product;
  const finalPrice = isNegotiatedPurchase
    ? negotiated_deal.negotiatedPrice
    : product?.Product_price;
  const finalQuantity = isNegotiatedPurchase
    ? negotiated_deal.quantity
    : quantity;

  useEffect(() => {
    if (!product) {
      toast.error("No product selected");
      navigate("/products");
    }
  }, [product, navigate]);

  useEffect(() => {
    if (Tracking_id) {
      toast.success("Order placed successfully!");
      // Clear negotiated deal after successful purchase
      if (isNegotiatedPurchase) {
        clearNegotiatedDeal();
      }
      navigate(`/track/${Tracking_id}`);
    }
  }, [Tracking_id]);

  // Set quantity from negotiated deal
  useEffect(() => {
    if (isNegotiatedPurchase && negotiated_deal) {
      setQuantity(negotiated_deal.quantity);
    }
  }, [isNegotiatedPurchase, negotiated_deal]);

  const handleQuantityChange = (delta) => {
    // Don't allow quantity change for negotiated deals
    if (isNegotiatedPurchase) return;

    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.Product_Qty || 1)) {
      setQuantity(newQty);
    }
  };

  const calculateTotal = () => {
    const subtotal = finalPrice * finalQuantity;
    const deliveryCharge = 50; // Fixed delivery charge
    const discount = isNegotiatedPurchase
      ? (product?.Product_price - finalPrice) * finalQuantity
      : 0;
    return {
      subtotal,
      deliveryCharge,
      discount,
      total: subtotal + deliveryCharge,
      originalTotal: product?.Product_price * finalQuantity + deliveryCharge,
    };
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    if (!deliveryPincode.trim() || deliveryPincode.length !== 6) {
      toast.error("Please enter valid 6-digit pincode");
      return;
    }

    setIsProcessing(true);

    try {
      const totals = calculateTotal();
      console.log({
        productid: product._id,
        quantity: finalQuantity,
        status: "pending",
        delivery: {
          address: deliveryAddress,
          pincode: deliveryPincode,
          charge: totals.deliveryCharge,
        },
        payment: {
          method: paymentMethod,
          amount: totals.total,
          originalAmount: totals.originalTotal,
          discount: totals.discount,
          isNegotiated: isNegotiatedPurchase,
        },
      })
      await Buy({
        productid: product._id,
        quantity: finalQuantity,
        status: "pending",
        delivery: {
          address: deliveryAddress,
          pincode: deliveryPincode,
          charge: totals.deliveryCharge,
        },
        payment: {
          method: paymentMethod,
          amount: totals.total,
          originalAmount: totals.originalTotal,
          discount: totals.discount,
          isNegotiated: isNegotiatedPurchase,
        },
      });
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-6 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => {
            RemoveBuy();
            if (isNegotiatedPurchase) {
              clearNegotiatedDeal();
            }
            navigate(-1);
          }}
          className="flex items-center gap-3 text-green-800 hover:text-green-600 font-semibold mb-8 transition-all hover:gap-4"
        >
          <FiArrowLeft size={24} />
          Back
        </button>

        {/* Negotiated Deal Banner */}
        {isNegotiatedPurchase && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FiTag size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Negotiated Deal!</h3>
                <p className="text-emerald-100">
                  You've successfully negotiated a special price for this product
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="flex gap-4 mb-6">
              <img
                src={product.Product_image || "/placeholder.jpg"}
                alt={product.Product_name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {product.Product_name}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <FiMapPin size={14} />
                  <span>{product.Product_location}</span>
                </div>
                <div className="mt-2">
                  {isNegotiatedPurchase ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{finalPrice}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{product.Product_price}
                      </span>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                        {Math.round(
                          ((product.Product_price - finalPrice) /
                            product.Product_price) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{product.Product_price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700">Quantity</span>
                {isNegotiatedPurchase ? (
                  <span className="text-lg font-bold text-gray-900">
                    {finalQuantity} units
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.Product_Qty}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                <FiPackage className="inline mr-1" />
                {product.Product_Qty} units available
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 pt-6 mt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totals.subtotal}</span>
              </div>
              {isNegotiatedPurchase && totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Negotiation Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <FiTruck size={16} />
                  Delivery
                </span>
                <span>₹{totals.deliveryCharge}</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-emerald-600">₹{totals.total}</span>
              </div>
              {isNegotiatedPurchase && (
                <p className="text-center text-sm text-green-600 font-medium">
                  You're saving ₹{totals.discount} with this deal!
                </p>
              )}
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="text-emerald-600" />
                Delivery Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete address..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={deliveryPincode}
                    onChange={(e) =>
                      setDeliveryPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-emerald-600" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod"
                        ? "border-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Pay when you receive
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "online"
                        ? "border-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "online" && (
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">
                      UPI / Card / Net Banking
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck size={24} />
                  Place Order - ₹{totals.total}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;