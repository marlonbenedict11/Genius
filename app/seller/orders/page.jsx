'use client';

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/order/seller-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-auto flex flex-col justify-between text-sm bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
          <div className="space-y-4 max-w-5xl">
            {orders.length > 0 ? orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                {/* Order Details */}
                <div className="flex-1 flex gap-5">
                  <Image
                    className="w-16 h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />
                  <div>
                    <p className="font-medium text-gray-700">
                      {order.items.map(item => `${item.product?.name} x ${item.quantity}`).join(", ")}
                    </p>
                    <p className="text-gray-500 text-sm">Items: {order.items.length}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="text-gray-600 text-sm">
                  <p className="font-medium text-gray-800">{order.address?.fullName}</p>
                  <p>{order.address?.area}</p>
                  <p>{`${order.address?.city}, ${order.address?.state}`}</p>
                  <p>{order.address?.phoneNumber}</p>
                </div>

                {/* Amount */}
                <p className="text-green-600 font-semibold my-auto whitespace-nowrap">
                  {currency}{order.amount}
                </p>

                {/* Status */}
                <div className="text-sm text-gray-600 my-auto">
                  <p>Method: <span className="font-medium">COD</span></p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Payment: <span className="text-red-500 font-medium">Pending</span></p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500">No orders available.</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
