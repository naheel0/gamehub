import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('gameStoreCart');
    const savedWishlist = localStorage.getItem('gameStoreWishlist');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Calculate total items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const handleProfileClick = () => {
    // You can add a profile page later
    navigate('/profile');
    setIsMenuOpen(false);
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
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                GameHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
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
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-700">
                <div className="p-3 text-sm">
                  <p className="font-semibold">{wishlistItems.length} items in wishlist</p>
                  <p className="text-gray-300">Click to view</p>
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
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-700">
                <div className="p-3 text-sm">
                  <p className="font-semibold">{getCartItemCount()} items in cart</p>
                  <p className="text-gray-300">Total: ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</p>
                </div>
              </div>
            </button>

            {/* User Account */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Welcome Message */}
                <span className="text-sm text-gray-300 hidden lg:block">
                  Welcome, {user.firstName}
                </span>
                
                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition duration-300 border border-red-600">
                    <UserIcon className="h-4 w-4" />
                    <span>Account</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-700">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs">{user.email}</p>
                      </div>
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition duration-300"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleWishlistClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition duration-300"
                      >
                        My Wishlist
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition duration-300 border-t border-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-1 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition duration-300 border border-red-600"
              >
                <UserIcon className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
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
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist ({wishlistItems.length})
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* User Section in Mobile Menu */}
            <div className="border-t border-gray-700 mt-2 pt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-300">
                    <p className="font-semibold">Welcome, {user.firstName}</p>
                    <p className="text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-red-400 transition duration-300"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-800 transition duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 transition duration-300 bg-red-600 hover:bg-red-700"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Cart Summary in Mobile Menu */}
            <div className="px-3 py-2 text-sm text-gray-300 border-t border-gray-700">
              <p>Cart: {getCartItemCount()} items</p>
              <p>Wishlist: {wishlistItems.length} items</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;