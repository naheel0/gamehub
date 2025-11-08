// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  UserIcon as UserSolid,
  ShoppingBagIcon as ShoppingBagSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { getCartSummary } = useCart();
  const { wishlist, getWishlistCount } = useWishlist();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        ...formData
      };

      const result = await updateUser(updatedUser);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cartSummary = getCartSummary();
  const wishlistCount = getWishlistCount();

  if (!user) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <UserIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
            <p className="text-gray-400 mb-8">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
                <UserSolid className="h-10 w-10 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-red-100 mt-1">{user.email}</p>
                <p className="text-red-200 text-sm mt-2">
                  Member since {user.createdAt ? formatDate(user.createdAt) : 'Recently'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-red-700 px-6 py-3 rounded-lg transition duration-300 border border-white border-opacity-30 flex items-center space-x-2"
            >
              <PencilIcon className="h-5 w-5" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-8">
              <nav className="space-y-2">
                {[
                  { id: 'overview', name: 'Overview', icon: UserIcon },
                  { id: 'orders', name: 'Order History', icon: ShoppingBagIcon },
                  { id: 'wishlist', name: 'Wishlist', icon: HeartIcon },
                  { id: 'addresses', name: 'Addresses', icon: MapPinIcon },
                  { id: 'payment', name: 'Payment Methods', icon: CreditCardIcon }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-300 ${
                      activeTab === item.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cart Items</span>
                    <span className="text-white font-semibold">{cartSummary.totalItems || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wishlist</span>
                    <span className="text-white font-semibold">{wishlistCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Orders</span>
                    <span className="text-white font-semibold">
                      {user.purchaseHistory ? user.purchaseHistory.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2 disabled:opacity-50"
                        >
                          <CheckIcon className="h-5 w-5" />
                          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
                        >
                          <XMarkIcon className="h-5 w-5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                          </label>
                          <p className="text-white text-lg">{user.firstName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                          </label>
                          <p className="text-white text-lg">{user.lastName}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          Email
                        </label>
                        <p className="text-white text-lg">{user.email}</p>
                      </div>
                      
                      {user.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            Phone Number
                          </label>
                          <p className="text-white text-lg">{user.phone}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Member Since
                        </label>
                        <p className="text-white text-lg">
                          {user.createdAt ? formatDate(user.createdAt) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center hover:border-red-500 transition duration-300">
                    <ShoppingBagSolid className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Shopping Cart</h3>
                    <p className="text-gray-400 mb-4">
                      {cartSummary.totalItems || 0} items • ${cartSummary.subtotal || '0.00'}
                    </p>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      View Cart
                    </button>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center hover:border-red-500 transition duration-300">
                    <HeartSolid className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Wishlist</h3>
                    <p className="text-gray-400 mb-4">
                      {wishlistCount} games saved for later
                    </p>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      View Wishlist
                    </button>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center hover:border-red-500 transition duration-300">
                    <CreditCardIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Order History</h3>
                    <p className="text-gray-400 mb-4">
                      {user.purchaseHistory ? user.purchaseHistory.length : 0} total orders
                    </p>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      View Orders
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === 'orders' && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
                
                {user.purchaseHistory && user.purchaseHistory.length > 0 ? (
                  <div className="space-y-4">
                    {user.purchaseHistory.map((order, index) => (
                      <div key={order.id || index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              Order #{order.id?.slice(-8).toUpperCase() || `ORDER_${index + 1}`}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {order.date ? formatDate(order.date) : 'Date not available'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-red-500">${order.summary?.total || '0.00'}</p>
                            <span className="inline-block bg-green-500 text-white px-2 py-1 rounded text-xs">
                              {order.status || 'Completed'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.image || '/api/placeholder/40/40'}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                  <p className="text-white font-medium">{item.name}</p>
                                  <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-white font-semibold">${item.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBagIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
                    <p className="text-gray-400 mb-6">Start shopping to see your order history here.</p>
                    <button
                      onClick={() => window.location.href = '/products'}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300"
                    >
                      Browse Games
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">My Wishlist</h2>
                
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((game) => (
                      <div key={game.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center space-x-4">
                          <img
                            src={game.images?.[0] || '/api/placeholder/80/80'}
                            alt={game.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">{game.name}</h3>
                            <p className="text-gray-400 text-sm mb-2">{game.genre}</p>
                            <p className="text-red-500 font-bold">${game.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HeartIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Wishlist Empty</h3>
                    <p className="text-gray-400 mb-6">Add games you love to your wishlist!</p>
                    <button
                      onClick={() => window.location.href = '/products'}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300"
                    >
                      Browse Games
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Saved Addresses</h2>
                
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses.map((address, index) => (
                      <div key={address.id || index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{address.fullName}</h3>
                          {address.isDefault && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Default</span>
                          )}
                        </div>
                        <div className="space-y-2 text-gray-300">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          {address.phone && <p>Phone: {address.phone}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPinIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Saved Addresses</h3>
                    <p className="text-gray-400 mb-6">
                      Add addresses for faster checkout on your next purchase.
                    </p>
                    <p className="text-gray-500 text-sm">
                      You can add addresses during the checkout process.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Methods</h2>
                
                <div className="text-center py-12">
                  <CreditCardIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Saved Payment Methods</h3>
                  <p className="text-gray-400 mb-6">
                    Your payment methods are processed securely and not stored on our servers.
                  </p>
                  <p className="text-gray-500 text-sm">
                    For security reasons, we do not store your payment information.
                    You'll need to enter your payment details during each checkout.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;