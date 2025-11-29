import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import { 
  FiArrowLeft, 
  FiBox, 
  FiTruck, 
  FiMapPin, 
  FiCalendar,
  FiDollarSign 
} from "react-icons/fi";

const MyOrders = () => {
  const { Myorder, Checkorder, AuthUser, RemoveBuy } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Shipping": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Placed": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { RemoveBuy(); navigate("/"); }} 
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
            >
              <FiArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            {orders.length} Orders
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length > 0 ? (
            orders.map((o) => (
              <div
                key={o._id}
                onClick={() => navigate(`/track?tracking_id=${o.tracking_id}`)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between group"
              >
                {/* Top: ID & Date */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FiCalendar size={12} />
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-500 truncate" title={o.tracking_id}>
                    ID: {o.tracking_id}
                  </p>
                </div>

                {/* Middle: Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <FiMapPin size={12} /> Current Location
                    </p>
                    <p className="font-semibold text-gray-800">{o.reached || "Processing"}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <FiTruck size={12} /> Total Distance
                    </p>
                    <p className="font-semibold text-gray-800">{o.total_distance} km</p>
                  </div>
                </div>

                {/* Bottom: Price & Action */}
                <div className="bg-gray-50 -mx-5 -mb-5 p-4 flex justify-between items-center rounded-b-2xl group-hover:bg-emerald-50 transition-colors">
                  <div>
                    <p className="text-xs text-gray-500">Total Charge</p>
                    <p className="text-lg font-bold text-emerald-600 flex items-center">
                      ₹{o.charge}
                    </p>
                  </div>
                  <button className="text-sm font-semibold text-emerald-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 group-hover:border-emerald-200">
                    Track Details
                  </button>
                </div>
              </div>
            ))
          ) : (
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