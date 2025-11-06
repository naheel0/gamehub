// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // JSON Server base URL
  const API_BASE = 'http://localhost:3001';

  // Load cart from JSON Server when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user's cart from JSON Server
        const response = await fetch(`${API_BASE}/users/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        const cartItems = userData.cart || [];

        // Fetch full game details for each cart item
        if (cartItems.length > 0) {
          const cartPromises = cartItems.map(async (cartItem) => {
            try {
              const gameResponse = await fetch(`${API_BASE}/games/${cartItem.gameId}`);
              if (gameResponse.ok) {
                const game = await gameResponse.json();
                return {
                  ...game,
                  quantity: cartItem.quantity,
                  cartItemId: cartItem.id,
                  addedAt: cartItem.addedAt
                };
              }
            } catch (error) {
              console.error(`Error fetching game ${cartItem.gameId}:`, error);
            }
            return null;
          });

          const cartGames = (await Promise.all(cartPromises)).filter(item => item !== null);
          setCart(cartGames);
        } else {
          setCart([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Failed to load cart');
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Generate unique ID for cart items
  const generateCartItemId = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Add item to cart
  const addToCart = async (game, quantity = 1) => {
    if (!user) {
      toast.warning('Please log in to add items to your cart.');
      return false;
    }

    if (!game.inStock) {
      toast.error('Sorry, this game is out of stock!');
      return false;
    }

    try {
      // Get current user data
      const userResponse = await fetch(`${API_BASE}/users/${user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const currentCart = userData.cart || [];

      // Check if game is already in cart
      const existingItemIndex = currentCart.findIndex(item => item.gameId === game.id);
      let updatedCart;

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        updatedCart = currentCart.map((item, index) => 
          index === existingItemIndex 
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                updatedAt: new Date().toISOString()
              }
            : item
        );
      } else {
        // Add new item to cart
        const newCartItem = {
          id: generateCartItemId(),
          gameId: game.id,
          quantity: quantity,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedCart = [...currentCart, newCartItem];
      }

      // Update user's cart in JSON Server
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update cart');
      }

      // Reload cart
      const reloadResponse = await fetch(`${API_BASE}/users/${user.id}`);
      const updatedUserData = await reloadResponse.json();
      const updatedCartItems = updatedUserData.cart || [];
      
      if (updatedCartItems.length > 0) {
        const cartPromises = updatedCartItems.map(async (cartItem) => {
          try {
            const gameResponse = await fetch(`${API_BASE}/games/${cartItem.gameId}`);
            if (gameResponse.ok) {
              const game = await gameResponse.json();
              return {
                ...game,
                quantity: cartItem.quantity,
                cartItemId: cartItem.id,
                addedAt: cartItem.addedAt
              };
            }
          } catch (error) {
            console.error(`Error fetching game ${cartItem.gameId}:`, error);
          }
          return null;
        });

        const cartGames = (await Promise.all(cartPromises)).filter(item => item !== null);
        setCart(cartGames);
      } else {
        setCart([]);
      }
      
      toast.success(`${game.name} added to cart!`);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (gameId) => {
    if (!user) {
      toast.warning('Please log in to manage your cart.');
      return false;
    }

    try {
      // Get current user data
      const userResponse = await fetch(`${API_BASE}/users/${user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const updatedCart = (userData.cart || []).filter(item => item.gameId !== gameId);

      // Update user's cart in JSON Server
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update cart');
      }

      // Update local state
      const removedGame = cart.find(item => item.id === gameId);
      setCart(prev => prev.filter(item => item.id !== gameId));
      
      if (removedGame) {
        toast.info(`${removedGame.name} removed from cart`);
      }
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (gameId, newQuantity) => {
    if (!user) {
      toast.warning('Please log in to manage your cart.');
      return false;
    }

    if (newQuantity < 1) {
      return await removeFromCart(gameId);
    }

    try {
      // Get current user data
      const userResponse = await fetch(`${API_BASE}/users/${user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const updatedCart = (userData.cart || []).map(item => 
        item.gameId === gameId 
          ? { ...item, quantity: newQuantity, updatedAt: new Date().toISOString() }
          : item
      );

      // Update user's cart in JSON Server
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: updatedCart
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update cart');
      }

      // Update local state
      setCart(prev => prev.map(item => 
        item.id === gameId ? { ...item, quantity: newQuantity } : item
      ));
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) {
      toast.warning('Please log in to manage your cart.');
      return false;
    }

    try {
      // Update user's cart in JSON Server
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: []
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to clear cart');
      }

      // Update local state
      setCart([]);
      toast.info('Cart cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  };

  // Get cart summary - FIXED THIS FUNCTION
  const getCartSummary = () => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return {
      totalItems,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      items: cart.length
    };
  };

  // Get item quantity
  const getItemQuantity = (gameId) => {
    const item = cart.find(item => item.id === gameId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (gameId) => {
    return cart.some(item => item.id === gameId);
  };

  // Check if cart is empty
  const isEmpty = () => {
    return cart.length === 0;
  };

  // Checkout process
  const checkout = async (paymentMethod = 'card') => {
    if (!user) {
      toast.warning('Please log in to checkout.');
      return { success: false, error: 'User not logged in' };
    }

    if (isEmpty()) {
      toast.warning('Your cart is empty.');
      return { success: false, error: 'Cart is empty' };
    }

    try {
      // Get current user data
      const userResponse = await fetch(`${API_BASE}/users/${user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const purchaseHistory = userData.purchaseHistory || [];
      const summary = getCartSummary();

      // Create order
      const order = {
        id: generateCartItemId(),
        items: cart.map(item => ({
          gameId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0]
        })),
        summary: {
          subtotal: summary.subtotal,
          tax: summary.tax,
          total: summary.total
        },
        paymentMethod,
        status: 'completed',
        date: new Date().toISOString()
      };

      // Update user's purchase history and clear cart
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseHistory: [...purchaseHistory, order],
          cart: []
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to process checkout');
      }

      // Update local state
      setCart([]);
      toast.success('Order placed successfully! Thank you for your purchase.');
      return { success: true, order };
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to process checkout');
      return { success: false, error: error.message };
    }
  };

  // Refresh cart data
  const refreshCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      const cartItems = userData.cart || [];

      if (cartItems.length > 0) {
        const cartPromises = cartItems.map(async (cartItem) => {
          try {
            const gameResponse = await fetch(`${API_BASE}/games/${cartItem.gameId}`);
            if (gameResponse.ok) {
              const game = await gameResponse.json();
              return {
                ...game,
                quantity: cartItem.quantity,
                cartItemId: cartItem.id,
                addedAt: cartItem.addedAt
              };
            }
          } catch (error) {
            console.error(`Error fetching game ${cartItem.gameId}:`, error);
          }
          return null;
        });

        const cartGames = (await Promise.all(cartPromises)).filter(item => item !== null);
        setCart(cartGames);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const value = {
    // State
    cart,
    loading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    refreshCart,
    
    // Getters
    getCartSummary,
    getItemQuantity,
    isInCart,
    isEmpty,
    
    // Computed values
    getCartItemCount: () => getCartSummary().totalItems,
    getTotalPrice: () => parseFloat(getCartSummary().subtotal),
    isCartEmpty: isEmpty
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};