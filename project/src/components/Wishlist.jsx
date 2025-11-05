// Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  StarIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add this comprehensive debug effect to Wishlist.jsx
useEffect(() => {
  const savedWishlist = localStorage.getItem('gameStoreWishlist');
  console.log('🔄 WISHLIST PAGE STATE:', {
    wishlistItemsCount: wishlistItems.length,
    wishlistItems: wishlistItems.map(item => ({ id: item.id, name: item.name })),
    localStorageCount: savedWishlist ? JSON.parse(savedWishlist).length : 0,
    localStorageItems: savedWishlist ? JSON.parse(savedWishlist).map(item => ({ id: item?.id, name: item?.name })) : []
  });
}, [wishlistItems]);
  
  // Get cart functions from context
  const { addToCart } = useCart();

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('gameStoreWishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
    setLoading(false);
  }, []);

  // DEBUG: Log wishlist items when they change
  useEffect(() => {
    console.log('Wishlist page items:', wishlistItems);
    console.log('Wishlist items count:', wishlistItems.length);
  }, [wishlistItems]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameStoreWishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const removeFromWishlist = (gameId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== gameId));
  };

  const moveToCart = (game) => {
    if (game.inStock) {
      addToCart(game);
      removeFromWishlist(game.id);
      alert(`${game.name} moved to cart!`);
    } else {
      alert('Sorry, this game is out of stock!');
    }
  };

  const addToCartFromWishlist = (game) => {
    if (game.inStock) {
      addToCart(game);
      alert(`${game.name} added to cart!`);
    } else {
      alert('Sorry, this game is out of stock!');
    }
  };

  const clearWishlist = () => {
    if (wishlistItems.length > 0 && window.confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([]);
    }
  };

  // Render stars for rating (same as your Products page)
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < Math.floor(rating) ? (
        <StarIcon key={index} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarOutline key={index} className="h-4 w-4 text-yellow-400" />
      )
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="flex items-center text-purple-600 hover:text-purple-700 transition duration-300"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Games
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding games you love to your wishlist to keep track of them!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(game => (
                <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  {/* Game Image with Link */}
                  <Link to={`/product/${game.id}`}>
                    <div className="relative">
                      <img
                        src={game.images && game.images[0] ? game.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={game.name}
                        className="w-full h-48 object-cover cursor-pointer"
                      />
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromWishlist(game.id);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition duration-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      {/* Out of Stock Badge */}
                      {!game.inStock && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Game Info */}
                  <div className="p-4">
                    {/* Game Title with Link */}
                    <Link to={`/product/${game.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 cursor-pointer transition duration-300">
                        {game.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{game.genre}</p>
                    <p className="text-xs text-gray-500 mb-3">{game.platform}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {renderStars(game.rating)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{game.rating}</span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${game.price}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveToCart(game)}
                          disabled={!game.inStock}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition duration-300 ${
                            game.inStock
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCartIcon className="h-4 w-4" />
                          <span>Move to Cart</span>
                        </button>
                        <button
                          onClick={() => addToCartFromWishlist(game)}
                          disabled={!game.inStock}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition duration-300 ${
                            game.inStock
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCartIcon className="h-4 w-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Wishlist Summary</h3>
                  <p className="text-gray-600">
                    Total items: {wishlistItems.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${wishlistItems.reduce((total, game) => total + game.price, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;