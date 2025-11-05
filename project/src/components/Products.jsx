import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';

const Products = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get cart functions from context
  const { addToCart } = useCart();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(6);

  // Fetch data from db.json and load from localStorage
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/db.json');
        if (!response.ok) {
          throw new Error('Failed to fetch games data');
        }
        const data = await response.json();
        setGames(data.games);
        setFilteredGames(data.games);
        
        // Load wishlist from localStorage
        const savedWishlist = localStorage.getItem('gameStoreWishlist');
        
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameStoreWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter and sort games
  useEffect(() => {
    let result = [...games];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== 'All') {
      result = result.filter(game => game.genre === selectedGenre);
    }

    // Filter by platform
    if (selectedPlatform !== 'All') {
      result = result.filter(game => game.platform.includes(selectedPlatform));
    }

    // Sort games
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredGames(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [games, searchTerm, selectedGenre, selectedPlatform, sortBy]);

  // Get current games for pagination
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  // Calculate total pages
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get unique genres and platforms
  const genres = ['All', ...new Set(games.map(game => game.genre))];
  const platforms = ['All', ...new Set(games.flatMap(game => game.platform.split(', ')))];

  // Wishlist functions
  const toggleWishlist = (game) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item.id === game.id);
      let newWishlist;
      
      if (isInWishlist) {
        // Remove from wishlist
        newWishlist = prev.filter(item => item.id !== game.id);
        console.log('Removed from wishlist:', game.name);
      } else {
        // Add to wishlist - ensure we have all required properties
        const wishlistGame = {
          id: game.id,
          name: game.name,
          genre: game.genre,
          platform: game.platform,
          price: game.price,
          rating: game.rating,
          inStock: game.inStock,
          images: game.images,
          description: game.description,
          trailer: game.trailer
        };
        newWishlist = [...prev, wishlistGame];
        console.log('Added to wishlist:', game.name);
      }
      
      return newWishlist;
    });
  };

  // Check if game is in wishlist
  const isInWishlist = (gameId) => {
    return wishlist.some(item => item.id === gameId);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < Math.floor(rating) ? (
        <StarIcon key={index} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarOutline key={index} className="h-4 w-4 text-yellow-400" />
      )
    ));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <p className="mt-2 text-sm text-gray-400">Make sure db.json is in the public folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Our Games Collection</h1>
          <p className="text-lg text-gray-300">Discover the latest and greatest games</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-8 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentGames.map(game => (
            <div key={game.id} className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-800 hover:border-gray-700">
              {/* Game Image with Link */}
              <Link to={`/product/${game.id}`}>
                <div className="relative">
                  <img
                    src={game.images[0]}
                    alt={game.name}
                    className="w-full h-48 object-cover cursor-pointer"
                  />
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(game);
                    }}
                    className="absolute top-2 right-2 p-2 bg-gray-800 rounded-full shadow-md hover:bg-gray-700 transition duration-300 border border-gray-700"
                    title={isInWishlist(game.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isInWishlist(game.id) ? (
                      <HeartIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartOutline className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {/* Out of Stock Badge */}
                  {!game.inStock && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
              </Link>

              {/* Game Info */}
              <div className="p-4">
                {/* Game Title with Link */}
                <Link to={`/product/${game.id}`}>
                  <h3 className="text-lg font-semibold text-white mb-2 hover:text-red-500 cursor-pointer transition duration-300">
                    {game.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-400 mb-2">{game.genre}</p>
                <p className="text-xs text-gray-500 mb-3">{game.platform}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {renderStars(game.rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-300">{game.rating}</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">${game.price}</span>
                  </div>
                  <button
                    onClick={() => addToCart(game)}
                    disabled={!game.inStock}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition duration-300 ${
                      game.inStock
                        ? 'bg-red-600 hover:bg-red-700 text-white border border-red-600'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                    }`}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>{game.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No games found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('All');
                setSelectedPlatform('All');
              }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 border border-red-600"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredGames.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((number, index) => (
              <button
                key={index}
                onClick={() => typeof number === 'number' && paginate(number)}
                className={`px-4 py-2 rounded-lg border ${
                  number === currentPage
                    ? 'bg-red-600 text-white border-red-600'
                    : number === '...'
                    ? 'bg-gray-800 text-gray-500 cursor-default border-gray-700'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600'
                }`}
                disabled={number === '...'}
              >
                {number}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600'
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;