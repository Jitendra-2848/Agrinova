import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const DeliveryHistory = () => {
  const navigate = useNavigate();
  const { Delivery_history, Del_history,transporter_income } = useAuthStore();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load delivered orders from backend
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Delivery_history(); // fetch delivered orders from backend
      setLoading(false);
    };
    load();
  }, []);

  useEffect(()=>{

  },[])

  // Sync store data into component state
  useEffect(() => {
    if (!Del_history) return;
    
    // if backend returns: { data: [...] }
    const data = Array.isArray(Del_history)
      ? Del_history
      : Del_history.data || [];

    setHistory(data);
  }, [Del_history]);

  // Total earnings (sum of all product delivery charges)
  const totalEarnings = history.reduce((sum, job) => {
    const amount = job.products?.[0]?.delivery?.charge || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-green-900 hover:text-green-700 font-semibold mb-2"
      >
        ⬅️ Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Delivery History 📦
      </h1>

      {/* Total earnings */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Total Earnings
        </h2>
        <div className="text-3xl font-bold text-green-600">₹{transporter_income}</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">Order ID</th>
              {/* <th className="text-left px-6 py-3 text-gray-700 font-semibold">Product</th> */}
              {/* <th className="text-left px-6 py-3 text-gray-700 font-semibold">Pickup → Drop</th> */}
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">Distance</th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">Income</th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">Delivered On</th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Loading delivery history...
                </td>
              </tr>
            )}

            {!loading && history.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No delivered orders found.
                </td>
              </tr>
            )}

            {!loading &&
              history.map((order,index) => {
                // const product = order.products?.[index];
                const amount = order?.charge || 0;
                const distance = order?.delivery?.distance_cover || "Incomplete";
                const pickup = order?.delivery?.pickup || "Unknown";
                const drop = order?.delivery?.pincode || "Unknown";
                // console.log(product)
                return (
                  <tr key={index} className="border-b hover:bg-gray-300 transition hover:cursor-pointer" onClick={()=>{navigate(`/track?tracking_id=${order.tracking_id}`)}}>
                    <td className="px-6 py-4">{order.tracking_id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">{distance}</td>
                    <td className="px-6 py-4">₹{amount}</td>
                   <td className="px-6 py-4">{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</td>

                    <td className="px-6 py-4 font-semibold text-green-600">Delivered</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryHistory;
