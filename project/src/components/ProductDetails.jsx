import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon, ArrowLeftIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { GiFastBackwardButton } from 'react-icons/gi';
import { MdArrowForwardIos,MdArrowBackIosNew } from "react-icons/md";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Get cart functions from context
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  // JSON Server base URL
  const API_BASE = 'http://localhost:3001';

  // Full screen image viewer state
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch('/db.json');
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
        const data = await response.json();
        const foundGame = data.games.find(g => g.id === parseInt(id));
        
        if (foundGame) {
          setGame(foundGame);
          // Check if game is in user's wishlist
          if (user) {
            checkWishlistStatus(foundGame.id);
          }
        } else {
          throw new Error('Game not found');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, user]);

  // Check if game is in user's wishlist
  const checkWishlistStatus = async (gameId) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_BASE}/wishlists?userId=${user.id}&gameId=${gameId}`);
      if (!response.ok) {
        throw new Error('Failed to check wishlist status');
      }
      const wishlistItems = await response.json();
      setIsInWishlist(wishlistItems.length > 0);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Add/Remove from wishlist in db.json
  const toggleWishlist = async () => {
    if (!game) return;
    
    if (!user) {
      alert('Please login to manage your wishlist');
      navigate('/login', { state: { from: `/product/${game.id}` } });
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`${API_BASE}/wishlists?userId=${user.id}&gameId=${game.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist item');
        }
        const wishlistItems = await response.json();
        
        if (wishlistItems.length > 0) {
          const deleteResponse = await fetch(`${API_BASE}/wishlists/${wishlistItems[0].id}`, {
            method: 'DELETE',
          });
          
          if (!deleteResponse.ok) {
            throw new Error('Failed to remove from wishlist');
          }
          
          setIsInWishlist(false);
          console.log('Removed from wishlist:', game.name);
        }
      } else {
        // Add to wishlist
        const response = await fetch(`${API_BASE}/wishlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            gameId: game.id,
            addedAt: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add to wishlist');
        }

        setIsInWishlist(true);
        console.log('Added to wishlist:', game.name);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Full screen image functions
  const openFullScreen = (index) => {
    setFullScreenImageIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const nextImage = () => {
    setFullScreenImageIndex(prev => 
      prev < game.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setFullScreenImageIndex(prev => 
      prev > 0 ? prev - 1 : game.images.length - 1
    );
  };

  // Keyboard navigation for full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullScreen) return;
      
      if (e.key === 'Escape') {
        closeFullScreen();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const handleAddToCart = () => {
    if (game && game.inStock) {
      // Add the game multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(game);
      }
      alert(`${quantity} ${game.name} added to cart!`);
    } else {
      alert('Sorry, this game is out of stock!');
    }
  };

  const buyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < Math.floor(rating) ? (
        <StarIcon key={index} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarOutline key={index} className="h-5 w-5 text-yellow-400" />
      )
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Game not found</p>
          <Link
            to="/products"
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 border border-red-600"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white mb-6"
          >
            <GiFastBackwardButton className="h-10 w-10" />
          </button>

          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Images & Video */}
              <div className="space-y-6">
                {/* Main Image/Video Display */}
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  {showVideo ? (
                    <div className="relative pt-[56.25%]">
                      <iframe
                        src={game.trailer}
                        title={`${game.name} Trailer`}
                        className="absolute top-0 left-0 w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div 
                      className="cursor-zoom-in"
                      onClick={() => openFullScreen(selectedImageIndex)}
                    >
                      <img
                        src={game.images[selectedImageIndex]}
                        alt={`${game.name} - Image ${selectedImageIndex + 1}`}
                        className="w-full h-96 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-5 gap-3">
                  {/* Video Thumbnail */}
                  <button
                    onClick={() => {
                      setShowVideo(true);
                      setSelectedImageIndex(0);
                    }}
                    className={`relative rounded-lg overflow-hidden border-2 ${
                      showVideo ? 'border-red-600' : 'border-gray-600'
                    }`}
                  >
                    <div className="aspect-square bg-gray-700 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-1">
                          <span className="text-white text-xs">▶</span>
                        </div>
                        <span className="text-xs">Trailer</span>
                      </div>
                    </div>
                  </button>

                  {/* Image Thumbnails */}
                  {game.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setShowVideo(false);
                        setSelectedImageIndex(index);
                      }}
                      className={`rounded-lg overflow-hidden border-2 cursor-pointer ${
                        !showVideo && selectedImageIndex === index 
                          ? 'border-red-600' 
                          : 'border-gray-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${game.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Image Navigation */}
                {!showVideo && game.images.length > 1 && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev > 0 ? prev - 1 : game.images.length - 1
                      )}
                      className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-600 text-white"
                    >
                       <MdArrowBackIosNew/>
                    </button>
                    <span className="px-4 py-2 text-gray-300">
                      {selectedImageIndex + 1} / {game.images.length}
                    </span>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev < game.images.length - 1 ? prev + 1 : 0
                      )}
                      className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-600 text-white"
                    >
                       <MdArrowForwardIos/>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{game.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(game.rating)}
                      <span className="ml-2 text-lg font-semibold text-gray-300">
                        {game.rating}/5.0
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      game.inStock 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {game.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-white">${game.price}</span>
                  {game.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">${game.originalPrice}</span>
                  )}
                </div>

                {/* Game Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-300">Genre:</span>
                    <p className="text-gray-400">{game.genre}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-300">Platform:</span>
                    <p className="text-gray-400">{game.platform}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-300">Description:</span>
                    <p className="text-gray-400 mt-1">{game.description}</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-300">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 border border-gray-600 text-white"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 border border-gray-600 text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!game.inStock}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg transition duration-300 border ${
                      game.inStock
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
                    }`}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={buyNow}
                    disabled={!game.inStock}
                    className={`flex-1 py-3 px-6 rounded-lg transition duration-300 border ${
                      game.inStock
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
                    }`}
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className={`p-3 rounded-lg border transition duration-300 ${
                      isInWishlist
                        ? 'bg-red-900 border-red-700 text-red-400'
                        : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                    } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {wishlistLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : isInWishlist ? (
                      <HeartIcon className="h-5 w-5" />
                    ) : (
                      <HeartOutline className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* User Status */}
                {!user && (
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <p className="text-sm text-gray-300 text-center">
                      <Link to="/login" className="text-red-400 hover:text-red-300">
                        Login
                      </Link> to save games to your wishlist
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Features</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>✅ Instant digital delivery</li>
                    <li>✅ Free updates and patches</li>
                    <li>✅ 24/7 customer support</li>
                    <li>✅ 30-day money-back guarantee</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related Games Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {game.genre && (
                <div className="text-center py-8">
                  <p className="text-gray-400">More {game.genre} games coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 text-white hover:text-red-500 z-10 bg-gray-800 rounded-full p-2 border border-gray-600"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Navigation Buttons */}
          {game.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-500 z-10 bg-gray-800 rounded-full p-2 border border-gray-600"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-500 z-10 bg-gray-800 rounded-full p-2 border border-gray-600"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
            {fullScreenImageIndex + 1} / {game.images.length}
          </div>

          {/* Main Image */}
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={game.images[fullScreenImageIndex]}
              alt={`${game.name} - Image ${fullScreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-full px-4">
            {game.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setFullScreenImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                  fullScreenImageIndex === index 
                    ? 'border-red-600' 
                    : 'border-gray-600'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;