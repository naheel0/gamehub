import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlay, 
  FaChevronLeft, 
  FaChevronRight, 
  FaShoppingCart, 
  FaHeart,
  FaStar,
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaAward,
  FaGamepad,
  FaTimes
} from 'react-icons/fa';

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  // JSON Server base URL
  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_BASE}/games`); 
        if (!response.ok) {
          throw new Error('Failed to fetch games data');
        }
        const data = await response.json();
        // Take first 6 games for featured section
        setFeaturedGames(data.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching games:', err);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (!isPlaying || featuredGames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentGameIndex((prev) => 
        prev === featuredGames.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change game every 5 seconds

    return () => clearInterval(interval);
  }, [featuredGames.length, isPlaying]);

  const nextGame = () => {
    setCurrentGameIndex((prev) => 
      prev === featuredGames.length - 1 ? 0 : prev + 1
    );
  };

  const prevGame = () => {
    setCurrentGameIndex((prev) => 
      prev === 0 ? featuredGames.length - 1 : prev - 1
    );
  };

  const goToGame = (index) => {
    setCurrentGameIndex(index);
  };

  // FIXED VIDEO MODAL FUNCTION
  const openVideoModal = (trailerUrl) => {
    if (!trailerUrl) return;
    
    let videoSrc = trailerUrl;

    // Extract YouTube video ID and create proper embed URL
    if (trailerUrl.includes('youtube.com/embed/')) {
      // If it's already an embed URL, just add autoplay
      videoSrc = trailerUrl + (trailerUrl.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
    } else if (trailerUrl.includes('youtube.com/watch?v=')) {
      // Convert watch URL to embed URL
      const videoId = trailerUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    } else if (trailerUrl.includes('youtu.be/')) {
      // Convert youtu.be URL to embed URL
      const videoId = trailerUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    console.log('Video URL:', videoSrc); // Debug log
    setCurrentVideo(videoSrc);
    setShowVideoModal(true);
    setIsPlaying(false);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideo('');
    setIsPlaying(true);
  };

  const features = [
    {
      icon: <FaShippingFast className="text-3xl" />,
      title: "Instant Delivery",
      description: "Get your games instantly after purchase"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Secure Payment",
      description: "100% secure and encrypted transactions"
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support"
    },
    {
      icon: <FaAward className="text-3xl" />,
      title: "Best Prices",
      description: "Guaranteed lowest prices on all games"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`h-4 w-4 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading amazing games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        {featuredGames.length > 0 && (
          <div className="absolute inset-0">
            <img
              src={featuredGames[currentGameIndex].images?.[0] || '/images/placeholder-game.jpg'}
              alt={featuredGames[currentGameIndex].name}
              className="w-full h-full object-cover transition-opacity duration-10000 ease-in-out"
              onError={(e) => {
                e.target.src = '/images/placeholder-game.jpg';
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            {featuredGames.length > 0 && (
              <>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
                  {featuredGames[currentGameIndex].name}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
                  {featuredGames[currentGameIndex].description}
                </p>
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="flex items-center space-x-1">
                    {renderStars(featuredGames[currentGameIndex].rating)}
                  </div>
                  <span className="text-lg">{featuredGames[currentGameIndex].rating}/5.0</span>
                  <span className="text-lg font-semibold text-red-500">
                    ${featuredGames[currentGameIndex].price}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={`/product/${featuredGames[currentGameIndex].id}`}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105"
                  >
                    Buy Now
                  </Link>
                  <button
                    onClick={() => openVideoModal(featuredGames[currentGameIndex].trailer)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-red-700 px-8 py-4 rounded-lg font-bold text-lg transition duration-300 backdrop-blur-sm flex items-center justify-center border border-gray-400"
                  >
                    <FaPlay className="inline mr-2" />
                    Watch Trailer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Carousel Controls */}
        {featuredGames.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <button
              onClick={prevGame}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-red-600 transition duration-300 z-20 border border-gray-600"
            >
              <FaChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextGame}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-red-600 transition duration-300 z-20 border border-gray-600"
            >
              <FaChevronRight className="h-6 w-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {featuredGames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToGame(index)}
                  className={`w-3 h-3 rounded-full transition duration-300 ${
                    index === currentGameIndex ? 'bg-red-600' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* FIXED VIDEO MODAL */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-red-500 z-10 bg-black bg-opacity-70 rounded-full p-2 border border-gray-600"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-gray-700">
              {currentVideo ? (
                <iframe
                  src={currentVideo}
                  title="Game Trailer"
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <FaPlay className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Loading trailer...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose GameHub?</h2>
            <p className="text-xl text-gray-300">The ultimate gaming experience awaits</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-700">
                <div className="text-red-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Games</h2>
            <p className="text-xl text-gray-300">Discover our most popular titles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game) => (
              <div key={game.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition duration-300 border border-gray-800">
                <Link to={`/product/${game.id}`}>
                  <div className="relative">
                    <img
                      src={game.images?.[0] || '/images/placeholder-game.jpg'}
                      alt={game.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-game.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      ${game.price}
                    </div>
                    {/* Play Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openVideoModal(game.trailer);
                      }}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm border border-gray-400">
                        <FaPlay className="h-8 w-8 text-red-600" />
                      </div>
                    </button>
                  </div>
                </Link>
                <div className="p-6">
                  <Link to={`/product/${game.id}`}>
                    <h3 className="text-xl font-semibold text-white mb-2 hover:text-red-500 transition duration-300">
                      {game.name}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-sm mb-3">{game.genre}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(game.rating)}
                      <span className="text-gray-300 ml-1">{game.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{game.platform}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/product/${game.id}`}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-2 px-4 rounded transition duration-300"
                    >
                      View Details
                    </Link>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition duration-300 border border-gray-700">
                      <FaHeart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-transparent border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
            >
              View All Games
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaGamepad className="text-6xl text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join thousands of gamers and discover your next favorite game today. 
            Instant delivery, unbeatable prices, and endless entertainment await.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105"
            >
              Browse All Games
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-lg font-bold text-lg transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;