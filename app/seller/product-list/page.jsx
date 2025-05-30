'use client';

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editProductId, setEditProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    offerPrice: ""
  });

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  const handleEditClick = (product) => {
    setEditProductId(product._id);
    setEditFormData({
      name: product.name,
      category: product.category,
      offerPrice: product.offerPrice,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(`/api/product/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success("Product updated");
        setEditProductId(null);
        setEditFormData({});
        fetchSellerProduct();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleCancel = () => {
    setEditProductId(null);
    setEditFormData({});
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-600 text-sm">No products found.</p>
          ) : (
            <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
              <table className="table-fixed w-full overflow-hidden">
                <thead className="text-gray-900 text-sm text-left">
                  <tr>
                    <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                    <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                    <th className="px-4 py-3 font-medium truncate">Price</th>
                    <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500">
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-gray-500/20">
                      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                        <div className="bg-gray-500/10 rounded p-2">
                          <Image
                            src={product.images?.[0] || "/fallback.jpg"}
                            alt="Product Image"
                            className="w-16 h-16 object-cover rounded"
                            width={64}
                            height={64}
                          />
                        </div>
                        {editProductId === product._id ? (
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditChange}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          <span className="truncate w-full">{product.name}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 max-sm:hidden">
                        {editProductId === product._id ? (
                          <input
                            type="text"
                            name="category"
                            value={editFormData.category}
                            onChange={handleEditChange}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          product.category
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {editProductId === product._id ? (
                          <input
                            type="number"
                            name="offerPrice"
                            value={editFormData.offerPrice}
                            onChange={handleEditChange}
                            className="border px-2 py-1 rounded w-full"
                          />
                        ) : (
                          `UGX ${Number(product.offerPrice).toLocaleString('en-UG')}`
                        )}
                      </td>

                      <td className="px-4 py-3 max-sm:hidden">
                        {editProductId === product._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(product._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-400 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => router.push(`/product/${product._id}`)}
                              className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded"
                            >
                              Visit
                              <Image
                                className="h-3.5"
                                src={assets.redirect_icon}
                                alt="redirect_icon"
                                width={14}
                                height={14}
                              />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
