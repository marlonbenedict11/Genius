'use client'

import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";
  const router = useRouter();

  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    setProducts(productsDummyData);
    // Replace with API fetch if available
    // const response = await axios.get('/api/products');
    // setProducts(response.data.products);
  };

  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === 'seller') {
        setIsSeller(true);
      }

      const token = await getToken();
      const { data } = await axios.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        if (data.user.role === 'seller') {
          setIsSeller(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error?.response?.data || error.message);
    }
  };

  const addToCart = (itemId) => {
    let cartData = JSON.parse(JSON.stringify(cartItems));
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
  };

  const updateCartQuantity = (itemId, quantity) => {
    let cartData = JSON.parse(JSON.stringify(cartItems));
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  const getCartCount = useMemo(() => {
    let totalCount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalCount += cartItems[item];
      }
    }
    return totalCount;
  }, [cartItems]);

  const getCartAmount = useMemo(() => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const product = products.find((product) => product._id === item);
      if (product && cartItems[item] > 0) {
        totalAmount += product.offerPrice * cartItems[item];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  }, [cartItems, products]);

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
