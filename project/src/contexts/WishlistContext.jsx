import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // JSON Server base URL
  const API_BASE = 'http://localhost:3001';

  // Load wishlist from JSON Server when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user's wishlist from JSON Server
        const response = await fetch(`${API_BASE}/users/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        const wishlistIds = userData.wishlist || [];

        // Fetch full game details for each wishlist item
        if (wishlistIds.length > 0) {
          const wishlistPromises = wishlistIds.map(async (gameId) => {
            const gameResponse = await fetch(`${API_BASE}/games/${gameId}`);
            if (gameResponse.ok) {
              return await gameResponse.json();
            }
            return null;
          });

          const wishlistGames = (await Promise.all(wishlistPromises)).filter(game => game !== null);
          setWishlist(wishlistGames);
        } else {
          setWishlist([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast.error('Failed to load wishlist');
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  // Add item to wishlist in JSON Server
  const addToWishlist = async (game) => {
    if (!user) {
      toast.warning('Please log in to manage your wishlist.');
      return;
    }

    try {
      // Check if game is already in wishlist
      if (wishlist.some(item => item.id === game.id)) {
        toast.info(`${game.name} is already in your wishlist!`);
        return;
      }

      // Get current user data
      const userResponse = await fetch(`${API_BASE}/users/${user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const updatedWishlist = [...(userData.wishlist || []), game.id];

      // Update user's wishlist in JSON Server
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishlist: updatedWishlist
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update wishlist');
      }

      // Update local state
      setWishlist(prev => [...prev, game]);
      toast.success(`${game.name} added to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  // Remove item from wishlist in JSON Server
  const removeFromWishlist = async (gameId) => {
    if (!user) {
      toast.warning('Please log in to manage your wishlist.');
      return;
    }

    try {
      // Get current user data
      const userResponse = await fetch(`${API_BASE}/users/${user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const updatedWishlist = (userData.wishlist || []).filter(id => id !== gameId);

      // Update user's wishlist in JSON Server
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishlist: updatedWishlist
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update wishlist');
      }

      // Update local state
      const removedGame = wishlist.find(item => item.id === gameId);
      setWishlist(prev => prev.filter(item => item.id !== gameId));
      
      if (removedGame) {
        toast.info(`${removedGame.name} removed from wishlist`);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (gameId) => {
    return wishlist.some(item => item.id === gameId);
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!user) {
      toast.warning('Please log in to manage your wishlist.');
      return;
    }

    try {
      // Update user's wishlist in JSON Server
      const updateResponse = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishlist: []
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to clear wishlist');
      }

      // Update local state
      setWishlist([]);
      toast.info('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  // Move item from wishlist to cart
  const moveToCart = (item, addToCartFunction) => {
    if (item.inStock) {
      addToCartFunction(item);
      removeFromWishlist(item.id);
      toast.success(`${item.name} moved to cart!`);
    } else {
      toast.error(`${item.name} is out of stock!`);
    }
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Get wishlist total value
  const getWishlistTotal = () => {
    return wishlist.reduce((total, item) => total + item.price, 0);
  };

  // Check if wishlist is empty
  const isWishlistEmpty = () => {
    return wishlist.length === 0;
  };

  // Refresh wishlist (useful after login/logout)
  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      const wishlistIds = userData.wishlist || [];

      if (wishlistIds.length > 0) {
        const wishlistPromises = wishlistIds.map(async (gameId) => {
          const gameResponse = await fetch(`${API_BASE}/games/${gameId}`);
          if (gameResponse.ok) {
            return await gameResponse.json();
          }
          return null;
        });

        const wishlistGames = (await Promise.all(wishlistPromises)).filter(game => game !== null);
        setWishlist(wishlistGames);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart,
    getWishlistCount,
    getWishlistTotal,
    isWishlistEmpty,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};