'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'USD';
  const router = useRouter();

  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to fetch products');
    }
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
      console.error('Error fetching user data:', error?.response?.data || error.message);
    }
  };

  const fetchCartData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/cart/get', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCartItems(data.cartItems || {});
      }
    } catch (error) {
      console.error('Error fetching cart data:', error?.response?.data || error.message);
    }
  };

  const addToCart = async (itemId) => {
    const cartData = { ...cartItems };
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post('/api/cart/update', { cartData }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Item added to cart');
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || 'Failed to add item to cart');
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    const cartData = { ...cartItems };
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post('/api/cart/update', { cartData }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Cart updated');
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || 'Failed to update cart');
      }
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const product = products.find((product) => product._id === item);
      if (product && cartItems[item] > 0) {
        totalAmount += product.offerPrice * cartItems[item];
      }
    }
    return parseFloat(totalAmount.toFixed(2));
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchUserData();
      fetchCartData(); // load cart from DB
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
