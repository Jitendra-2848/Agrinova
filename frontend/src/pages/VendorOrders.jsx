import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { FiArrowLeft, FiBox, FiTruck, FiMapPin, FiCalendar, FiPackage, FiTag, FiDownload } from "react-icons/fi";
import { generateInvoice } from "./InvoiceGenerator";

const MyOrders = () => {
  const { Myorder, Checkorder, AuthUser, RemoveBuy } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthUser?._id) {
      Checkorder(AuthUser._id).finally(() => setLoading(false));
    }
  }, [AuthUser]);

  useEffect(() => {
    if (Myorder) {
      setOrders([...Myorder].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  }, [Myorder]);

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "bg-green-100 text-green-700 border-green-200",
      Shipping: "bg-blue-100 text-blue-700 border-blue-200",
      Placed: "bg-amber-100 text-amber-700 border-amber-200",
      Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleDownloadInvoice = async (order, e) => {
    e.stopPropagation();
    setGeneratingInvoice(order._id);
    await generateInvoice(order);
    setGeneratingInvoice(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => { RemoveBuy(); navigate("/"); }} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
              <FiArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">{orders.length} Orders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length > 0 ? orders.map((order) => {
            const productData = order.product?.[0] || {};
            const priceData = productData.price || {};
            const deliveryData = productData.delivery || {};
            const totalAmount = Number(priceData.amount) || 0;
            const discount = Number(priceData.discount) || 0;
            const deliveryCharge = Number(order.charge) || 0;
            const quantity = Number(productData.quantity) || 1;
            const distance = Number(order.total_distance) || 0;
            const isNegotiated = priceData.isNegotiated || false;

            return (
              <div key={order._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-200 transition-all group relative">
                
                <button onClick={(e) => handleDownloadInvoice(order, e)} disabled={generatingInvoice === order._id} className="absolute top-4 right-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm z-10 group/btn" title="Download Invoice">
                  {generatingInvoice === order._id ? (
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiDownload size={16} className="text-gray-600 group-hover/btn:text-emerald-600 transition-colors" />
                  )}
                </button>

                <div onClick={() => navigate(`/track?tracking_id=${order.tracking_id}`)} className="cursor-pointer">
                  
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2 pr-10">
                      <div className="flex gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(order.status)}`}>{order.status}</span>
                        {isNegotiated && <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded border border-purple-200 flex items-center gap-1"><FiTag size={10} /> Negotiated</span>}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-mono text-gray-500 truncate" title={order.tracking_id}>ID: {order.tracking_id.slice(0, 18)}...</p>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FiCalendar size={12} />{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm"><span className="text-gray-500 flex items-center gap-1"><FiPackage size={14} /> Quantity</span><span className="font-semibold text-gray-800">{quantity} units</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-gray-500 flex items-center gap-1"><FiMapPin size={14} /> Location</span><span className="font-semibold text-gray-800">{order.reached || "Processing"}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-gray-500 flex items-center gap-1"><FiTruck size={14} /> Distance</span><span className="font-semibold text-gray-800">{distance.toFixed(0)} km</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Payment</span><span className="font-semibold text-gray-800 uppercase">{priceData.method || "COD"}</span></div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 text-sm">
                    {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-semibold">-₹{discount}</span></div>}
                    <div className="flex justify-between text-gray-600"><span>Delivery Charge</span><span className="font-semibold">₹{deliveryCharge}</span></div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-base font-bold text-gray-900"><span>Total Amount</span><span className="text-emerald-600">₹{totalAmount}</span></div>
                  </div>

                  <div className="bg-gray-50 -mx-5 -mb-5 p-4 flex justify-between items-center rounded-b-2xl group-hover:bg-emerald-50 transition-colors">
                    <div className="flex items-center gap-2 text-gray-600"><FiBox size={16} /><span className="text-sm font-medium">Order Details</span></div>
                    <button className="text-sm font-semibold text-emerald-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 group-hover:border-emerald-200">Track →</button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <FiBox className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No orders found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;