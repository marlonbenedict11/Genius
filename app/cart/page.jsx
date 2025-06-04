'use client';
import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import Navbar from '@/components/Navbar';
import OrderSummary from '@/components/OrderSummary';
import { useAppContext } from '@/context/AppContext';

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  // Conversion rate (you might want to fetch this dynamically)
  const USD_TO_UGX = 3700; // Example rate, adjust as needed

  // Helper function to convert and format price
  const formatPriceUGX = (priceUSD) => {
    const priceUGX = priceUSD * USD_TO_UGX;
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(priceUGX);
  };

  const handleQuantityChange = (productId, value) => {
    const quantity = Number(value);
    if (!isNaN(quantity) && quantity >= 0) {
      updateCartQuantity(productId, quantity);
    }
  };

  const handleRemoveItem = (productId) => {
    updateCartQuantity(productId, 0);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        {/* Cart Items Section */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-6">
            <p className="text-2xl md:text-3xl text-gray-700">
              Your <span className="font-semibold text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-600">{getCartCount()} Items</p>
          </div>

          {/* Cart Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left text-sm text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-4 md:px-4 px-1">Product Details</th>
                  <th className="py-4 md:px-4 px-1">Price</th>
                  <th className="py-4 md:px-4 px-1">Quantity</th>
                  <th className="py-4 md:px-4 px-1">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find((p) => p._id === itemId);
                  const quantity = cartItems[itemId];

                  if (!product || quantity <= 0) return null;

                  return (
                    <tr key={itemId} className="border-b border-gray-100">
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-100 p-2">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => handleRemoveItem(product._id)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{product.name}</p>
                          <button
                            className="text-xs text-orange-600 mt-1"
                            onClick={() => handleRemoveItem(product._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-700">{formatPriceUGX(product.offerPrice)}</td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center gap-1 md:gap-2">
                          <button
                            onClick={() => updateCartQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            className="disabled:opacity-50"
                          >
                            <Image src={assets.decrease_arrow} alt="decrease" className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                            className="w-10 border rounded text-center appearance-none"
                            min="1"
                          />
                          <button onClick={() => addToCart(product._id)}>
                            <Image src={assets.increase_arrow} alt="increase" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-700">
                        {formatPriceUGX(product.offerPrice * quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => router.push('/all-products')}
            className="group flex items-center mt-6 gap-2 text-orange-600 font-medium"
          >
            <Image
              className="group-hover:-translate-x-1 transition-transform duration-200"
              src={assets.arrow_right_icon_colored}
              alt="arrow"
            />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary Section - Make sure to update this component to also use UGX */}
        <OrderSummary currency="UGX" conversionRate={USD_TO_UGX} />
      </div>
    </>
  );
};

export default Cart;