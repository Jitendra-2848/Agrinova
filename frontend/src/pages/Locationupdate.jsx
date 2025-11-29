import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

const LocationUpdate = () => {
  const navigate = useNavigate();
  const { activejob, activejobdata, updatejob,Delivered } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");      // tracking_id to update
  const [newPincode, setNewPincode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTransporter, setSelectedTransporter] = useState("");

  // Load active jobs once
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      await activejob();
      setLoading(false);
    };
    loadJobs();
  }, [activejob]);

  // Sync store data into local state
  useEffect(() => {
    if (!activejobdata) return;
    const data = Array.isArray(activejobdata)
      ? activejobdata
      : activejobdata.data || [];
    setOrders(data);
  }, [activejobdata]);

  const handleUpdate = () => {
    setMessage("");

    if (!orderId || !newPincode) {
      setMessage("❌ Please enter both Order ID and Pincode");
      return;
    }

    if (!/^\d{6}$/.test(newPincode)) {
      setMessage("❌ Pincode must be a 6 digit number");
      return;
    }

    const index = orders.findIndex((order) => order.tracking_id === orderId);
    if (index === -1) {
      setMessage("❌ Order ID not found in active jobs");
      return;
    }

    const payload = {
      id: orderId,
      reachedAt: newPincode,
      transporter: selectedTransporter,
    };
    updatejob(payload);

    const updated = [...orders];
    updated[index] = { ...updated[index], reached: newPincode };
    setOrders(updated);

    setMessage(`✅ Location updated for Order ID ${orderId}`);
    setNewPincode("");
  };

  // Mark order as delivered – only when reached pincode === destination pincode
  const handleDelivered = (order) => {
    setMessage("");

    const product = order.products?.[0];
    const destinationPin = product?.delivery?.pincode; // used internally only
    const currentPin = order.reached;

    if (!destinationPin) {
      setMessage("Destination not available for this order.");
      return;
    }

    // Compare using Number()
    if (Number(currentPin) !== Number(destinationPin)) {
      setMessage("Reach the destination first to mark as delivered.");
      return;
    }

    const shortId = order.tracking_id.slice(-6).toUpperCase();
    const confirmed = window.confirm(
      `Mark order #${shortId} as DELIVERED?\n\nAfter confirming, this order can no longer be updated.`
    );
    if (!confirmed) return;

    const payload = {
      id: order.tracking_id,
      reachedAt: order.reached,
      transporter: order.transporter,
      product_id:order.product_id,
      status: "Delivered",
    };
    Delivered(payload);

    setOrders((prev) =>
      prev.map((o) =>
        o.tracking_id === order.tracking_id
          ? { ...o, status: "Delivered" }
          : o
      )
    );

    if (orderId === order.tracking_id) setOrderId("");

    setMessage(`✅ Order #${shortId} marked as Delivered`);
  };

  const handleSelectOrder = (order) => {
    if (order.status === "Delivered") return; // can't select delivered
    setSelectedTransporter(order.transporter);
    setOrderId(order.tracking_id);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-sm font-semibold text-green-700 hover:text-green-800 mb-4"
        >
          ⬅️ Back to Home
        </button>

        {/* Page title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Update Delivery Location
        </h1>

        {/* Update Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Enter Order ID & New Pincode
          </h2>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              placeholder="Tracking ID (Order ID)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="New Pincode (6 digits)"
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleUpdate}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Update Location
            </button>
          </div>

          {message && (
            <p
              className={`mt-3 text-sm font-medium ${
                message.startsWith("❌") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Active Orders
          </h2>

          {loading && (
            <p className="text-gray-500 text-sm">Loading active orders...</p>
          )}

          {!loading && orders.length === 0 && (
            <p className="text-gray-500 text-sm">
              No active orders available to update.
            </p>
          )}

          <div className="space-y-4 mt-2">
            {orders.map((order) => {
              const isSelected = order.tracking_id === orderId;
              const isDelivered = order.status === "Delivered";

              const product = order.products?.[0];
              const destinationPin = product?.delivery?.pincode; // internal only
              const currentPin = order.reached;

              const canMarkDelivered =
                !isDelivered &&
                destinationPin &&
                Number(currentPin) === Number(destinationPin);

              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                    isSelected ? "border-green-500" : "border-gray-200"
                  }`}
                >
                  <div className="space-y-1 text-sm">
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.tracking_id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">
                      Status:{" "}
                      <span className="font-medium">{order.status}</span>
                    </p>
                    <p className="text-gray-600">
                      Current Location:{" "}
                      <span className="font-medium">
                        {currentPin || "N/A"}
                      </span>
                    </p>
                    {/* Destination: hide pincode visually, still used internally */}
                    <p className="text-gray-600">
                      Destination:{" "}
                      <span className="font-medium">City X,{order.products[0].delivery.pincode}</span>
                    </p>
                    <p className="text-gray-600">
                      Tracking ID:{" "}
                      <span className="font-mono text-xs">
                        {order.tracking_id}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {isDelivered ? (
                      <span className="text-sm font-semibold px-4 py-2 rounded-lg bg-green-100 text-green-700 border border-green-500 text-center">
                        Delivered
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSelectOrder(order)}
                          className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                            isSelected
                              ? "bg-green-100 text-green-700 border border-green-500"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {isSelected ? "Selected" : "Use This Order"}
                        </button>

                        <button
                          onClick={() =>
                            canMarkDelivered && handleDelivered(order)
                          }
                          disabled={!canMarkDelivered}
                          className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                            canMarkDelivered
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Mark as Delivered
                        </button>

                        {!canMarkDelivered && !isDelivered && (
                          <p className="text-[11px] text-gray-400">
                            Reach the destination pincode to enable delivery.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationUpdate;