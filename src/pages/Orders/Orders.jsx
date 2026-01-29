import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import userApi from "../../services/userApi"; // ✅ FIXED

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await userApi.get("/order/list"); // ✅
      if (res.data.success) setOrders(res.data.data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await userApi.post("/order/status", { orderId, status }); // ✅
      fetchOrders();
    } catch {
      toast.error("Status update failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Orders</h1>

      {orders.map((o) => (
        <div key={o._id} className="bg-white p-4 rounded shadow space-y-2">
          <p className="font-semibold">Order ID: {o._id}</p>

          <select
            value={o.status}
            onChange={(e) => updateStatus(o._id, e.target.value)}
            className="border p-2 rounded"
          >
            <option value="pending">Food Processing</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <p className="font-bold text-orange-600">₹{o.amount}</p>
        </div>
      ))}
    </div>
  );
}
