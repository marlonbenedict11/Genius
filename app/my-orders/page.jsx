"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/order/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>

          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-sm mt-6">You have no orders yet.</p>
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                >
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      src={assets.box_icon}
                      alt="Order Icon"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-base">
                        {order.items?.map((item) =>
                          item.product?.name
                            ? `${item.product.name} x ${item.quantity}`
                            : ''
                        ).join(", ")}
                      </p>
                      <p>Items: {order.items?.length || 0}</p>
                    </div>
                  </div>

                  <div className="min-w-[180px]">
                    <p className="font-medium">{order.address?.fullName}</p>
                    <p>{order.address?.area}</p>
                    <p>{`${order.address?.city}, ${order.address?.state}`}</p>
                    <p>{order.address?.phoneNumber}</p>
                  </div>

                  <div className="font-medium my-auto min-w-[100px]">
                    {currency}{order.amount}
                  </div>

                  <div className="min-w-[140px]">
                    <p>Method: COD</p>
                    <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                    <p>Payment: Pending</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
