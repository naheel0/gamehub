import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const navigate = useNavigate();

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('gameStoreCart');
    const savedWishlist = localStorage.getItem('gameStoreWishlist');
    const savedLogin = localStorage.getItem('gameStoreLoggedIn');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
    if (savedLogin) {
      setIsLoggedIn(JSON.parse(savedLogin));
    }
  }, []);

  // Calculate total items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleLogin = () => {
    const newLoginState = !isLoggedIn;
    setIsLoggedIn(newLoginState);
    localStorage.setItem('gameStoreLoggedIn', JSON.stringify(newLoginState));
    
    if (newLoginState) {
      alert('Successfully logged in!');
    } else {
      alert('Successfully logged out!');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  // Listen for storage changes to update cart and wishlist counts
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('gameStoreCart');
      const savedWishlist = localStorage.getItem('gameStoreWishlist');
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                GameHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-purple-300 transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-purple-300 transition duration-300"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-purple-300 transition duration-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-purple-300 transition duration-300"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist */}
            <button 
              onClick={handleWishlistClick}
              className="p-2 rounded-md hover:bg-gray-800 transition duration-300 relative group"
            >
              <HeartIcon className="h-6 w-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-3 text-sm">
                  <p className="font-semibold">{wishlistItems.length} items in wishlist</p>
                  <p className="text-gray-600">Click to view</p>
                </div>
              </div>
            </button>

            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className="p-2 rounded-md hover:bg-gray-800 transition duration-300 relative group"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-3 text-sm">
                  <p className="font-semibold">{getCartItemCount()} items in cart</p>
                  <p className="text-gray-600">Total: ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</p>
                </div>
              </div>
            </button>

            {/* Login/Logout */}
            <button
              onClick={toggleLogin}
              className="flex items-center space-x-1 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition duration-300"
            >
              <UserIcon className="h-4 w-4" />
              <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Wishlist */}
            <button 
              onClick={handleWishlistClick}
              className="p-2 rounded-md hover:bg-gray-800 transition duration-300 relative"
            >
              <HeartIcon className="h-6 w-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            
            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className="p-2 rounded-md hover:bg-gray-800 transition duration-300 relative"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-800 transition duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-purple-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-purple-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-purple-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist ({wishlistItems.length})
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-purple-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-purple-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Cart Summary in Mobile Menu */}
            <div className="px-3 py-2 text-sm text-gray-300 border-t border-gray-700 mt-2 pt-2">
              <p>Cart: {getCartItemCount()} items</p>
              <p>Wishlist: {wishlistItems.length} items</p>
            </div>

            {/* Mobile Login/Logout */}
            <button
              onClick={() => {
                toggleLogin();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-300 mt-2"
            >
              <UserIcon className="h-5 w-5" />
              <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;