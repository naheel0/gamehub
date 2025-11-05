// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Context
const CartContext = createContext();

// Custom Hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gameStoreCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameStoreCart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (game) => {
    if (!game.inStock) {
      alert('Sorry, this game is out of stock!');
      return;
    }

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === game.id);
      if (existingItem) {
        // Increase quantity if item exists
        return prev.map((item) =>
          item.id === game.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prev,
          {
            id: game.id,
            name: game.name,
            price: game.price,
            images: game.images,
            genre: game.genre,
            platform: game.platform,
            inStock: game.inStock,
            quantity: 1,
          },
        ];
      }
    });
    alert(`${game.name} added to cart!`);
  };

  // Update item quantity
  const updateQuantity = (gameId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === gameId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (gameId) => {
    setCart((prev) => prev.filter((item) => item.id !== gameId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Get total number of items in cart
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of all items in cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (gameId) => {
    return cart.some((item) => item.id === gameId);
  };

  // Value provided to consumers
  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getTotalPrice,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};