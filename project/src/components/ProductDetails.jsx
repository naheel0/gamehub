import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon, ArrowLeftIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [quantity, setQuantity] = useState(1);
  
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
  }, [id]);

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

  const toggleWishlist = () => {
    setWishlist(prev =>
      prev.includes(game.id)
        ? prev.filter(gameId => gameId !== game.id)
        : [...prev, game.id]
    );
  };

  const addToCart = () => {
    if (game.inStock) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === game.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          ...game,
          quantity: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${quantity} ${game.name} added to cart!`);
    } else {
      alert('Sorry, this game is out of stock!');
    }
  };

  const buyNow = () => {
    addToCart();
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Game not found</p>
          <Link
            to="/products"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Products</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Images & Video */}
              <div className="space-y-6">
                {/* Main Image/Video Display */}
                <div className="bg-gray-900 rounded-lg overflow-hidden">
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
                      showVideo ? 'border-purple-600' : 'border-gray-300'
                    }`}
                  >
                    <div className="aspect-square bg-gray-800 flex items-center justify-center">
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
                          ? 'border-purple-600' 
                          : 'border-gray-300'
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
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                      {selectedImageIndex + 1} / {game.images.length}
                    </span>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev < game.images.length - 1 ? prev + 1 : 0
                      )}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(game.rating)}
                      <span className="ml-2 text-lg font-semibold text-gray-700">
                        {game.rating}/5.0
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      game.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {game.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-gray-900">${game.price}</span>
                  {game.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${game.originalPrice}</span>
                  )}
                </div>

                {/* Game Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Genre:</span>
                    <p className="text-gray-600">{game.genre}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Platform:</span>
                    <p className="text-gray-600">{game.platform}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{game.description}</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={addToCart}
                    disabled={!game.inStock}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg transition duration-300 ${
                      game.inStock
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={buyNow}
                    disabled={!game.inStock}
                    className={`flex-1 py-3 px-6 rounded-lg transition duration-300 ${
                      game.inStock
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={toggleWishlist}
                    className={`p-3 rounded-lg border transition duration-300 ${
                      wishlist.includes(game.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {wishlist.includes(game.id) ? (
                      <HeartIcon className="h-5 w-5" />
                    ) : (
                      <HeartOutline className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {game.genre && (
                <div className="text-center py-8">
                  <p className="text-gray-600">More {game.genre} games coming soon!</p>
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
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Navigation Buttons */}
          {game.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
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
                    ? 'border-white' 
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