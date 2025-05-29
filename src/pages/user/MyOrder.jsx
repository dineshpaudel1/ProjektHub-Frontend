import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance"; // This should already be configured to attach token

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/api/user/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className=" mt-10 min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] px-4 sm:px-8 lg:px-16 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  Order #{order.orderId}
                </h2>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${order.status === "PLACED"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                    }`}
                >
                  #{order.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm mt-1">
                Total Items:{" "}
                <span className="font-medium">{order.numberOfItems}</span>
              </p>
              <p className="text-sm">
                Total Price:{" "}
                <span className="font-semibold text-indigo-600">
                  Rs. {order.totalPrice}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
