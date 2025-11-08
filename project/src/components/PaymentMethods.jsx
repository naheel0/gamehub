// src/components/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaApple, 
  FaGoogle, 
  FaShieldAlt, 
  FaLock,
  FaCheckCircle,
  FaRegCreditCard,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiStripe } from 'react-icons/si';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'india',
    phone: '',
    isDefault: false
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { getCartSummary, checkout, cart } = useCart();
  const { user, updateUser } = useAuth();

  const order = location.state?.order;
  const summary = order?.summary || getCartSummary();

  // Initialize addresses from user data or create empty array
  const userAddresses = user?.addresses || [];

  useEffect(() => {
    if (!user) {
      toast.warning('Please log in to proceed with payment.');
      navigate('/login');
      return;
    }

    if ((!order && cart.length === 0)) {
      toast.warning('Your cart is empty.');
      navigate('/cart');
    }

    // Set default address if available
    if (userAddresses.length > 0 && !selectedAddress) {
      const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [user, order, cart, navigate, userAddresses, selectedAddress]);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <FaCreditCard className="text-2xl" />,
      description: 'Pay securely with your credit or debit card',
      supported: ['Visa', 'Mastercard', 'American Express']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <FaPaypal className="text-2xl text-blue-400" />,
      description: 'Fast and secure payment with PayPal',
      supported: ['PayPal Balance', 'Linked Cards', 'Bank Account']
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: <FaApple className="text-2xl" />,
      description: 'Quick payment with Apple Pay',
      supported: ['iPhone', 'iPad', 'Mac']
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: <FaGoogle className="text-2xl text-green-400" />,
      description: 'Secure payment with Google Pay',
      supported: ['Android', 'Chrome', 'Web']
    }
  ];

  const securityFeatures = [
    {
      icon: <FaLock className="text-xl" />,
      title: 'SSL Encrypted',
      description: 'All transactions are 256-bit SSL encrypted'
    },
    {
      icon: <FaShieldAlt className="text-xl" />,
      title: 'PCI Compliant',
      description: 'We are PCI DSS Level 1 certified'
    },
    {
      icon: <FaCheckCircle className="text-xl" />,
      title: '3D Secure',
      description: 'Additional security layer for card payments'
    }
  ];

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleAddressInputChange = (field, value) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'india',
      phone: '',
      isDefault: false
    });
    setEditingAddress(null);
  };

  const validateAddress = () => {
    const required = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'country'];
    for (const field of required) {
      if (!addressForm[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (!/^\d{5}(-\d{4})?$/.test(addressForm.zipCode)) {
      toast.error('Please enter a valid ZIP code');
      return false;
    }

    if (addressForm.phone && !/^\d{10}$/.test(addressForm.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateAddress()) return;

    try {
      const newAddress = {
        id: editingAddress || `addr_${Date.now()}`,
        ...addressForm,
        zipCode: addressForm.zipCode.replace(/\D/g, ''),
        phone: addressForm.phone.replace(/\D/g, '')
      };

      let updatedAddresses;
      
      if (editingAddress) {
        // Update existing address
        updatedAddresses = userAddresses.map(addr => 
          addr.id === editingAddress ? newAddress : addr
        );
      } else {
        // Add new address
        if (addressForm.isDefault) {
          // Remove default flag from all other addresses
          updatedAddresses = userAddresses.map(addr => ({
            ...addr,
            isDefault: false
          }));
        }
        updatedAddresses = [...(updatedAddresses || userAddresses), newAddress];
      }

      // Update user in context and backend
      const updatedUser = { ...user, addresses: updatedAddresses };
      await updateUser(updatedUser);

      toast.success(`Address ${editingAddress ? 'updated' : 'saved'} successfully!`);
      setShowAddressForm(false);
      resetAddressForm();
      
      // Select the new/updated address
      setSelectedAddress(newAddress.id);
      
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault || false
    });
    setEditingAddress(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (userAddresses.length <= 1) {
      toast.error('You must have at least one address');
      return;
    }

    try {
      const updatedAddresses = userAddresses.filter(addr => addr.id !== addressId);
      const updatedUser = { ...user, addresses: updatedAddresses };
      await updateUser(updatedUser);

      // If deleted address was selected, select another one
      if (selectedAddress === addressId) {
        setSelectedAddress(updatedAddresses[0]?.id || null);
      }

      toast.success('Address deleted successfully!');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const updatedAddresses = userAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      const updatedUser = { ...user, addresses: updatedAddresses };
      await updateUser(updatedUser);
      
      toast.success('Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address.');
    }
  };

  const validateCardDetails = () => {
    if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.expiry.match(/^\d{2}\/\d{2}$/)) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      toast.error('Please enter a valid 3-digit CVV');
      return false;
    }
    if (cardDetails.name.trim().length < 2) {
      toast.error('Please enter cardholder name');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return false;
    }

    if (selectedMethod === 'card' && !validateCardDetails()) {
      return false;
    }

    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.warning('Please log in to complete payment.');
      navigate('/login');
      return;
    }

    if (!validatePayment()) {
      return;
    }

    setIsProcessing(true);

    try {
      const selectedAddressData = userAddresses.find(addr => addr.id === selectedAddress);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      let result;
      if (order) {
        result = { success: true, order };
      } else {
        result = await checkout(selectedMethod, selectedAddressData);
      }

      if (result.success) {
        toast.success('Payment processed successfully!');
        
        navigate('/order-confirmation', { 
          state: { 
            order: result.order,
            paymentMethod: selectedMethod,
            shippingAddress: selectedAddressData
          } 
        });
      } else {
        toast.error(result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    } 
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const getOrderItems = () => {
    if (order) {
      return order.items;
    }
    return cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images?.[0]
    }));
  };

  const orderItems = getOrderItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={handleBackToCart}
              className="flex items-center text-gray-400 hover:text-white transition duration-300 mb-2"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </button>
            <h1 className="text-4xl font-bold text-white">Complete Your Purchase</h1>
            <p className="text-lg text-gray-300 mt-2">Choose your preferred payment method</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Order Total</p>
            <p className="text-3xl font-bold text-red-500">${summary?.total || '0.00'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-3" />
                  Shipping Address
                </h2>
                <button
                  onClick={() => {
                    resetAddressForm();
                    setShowAddressForm(true);
                  }}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Add New</span>
                </button>
              </div>

              {showAddressForm ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => handleAddressInputChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={addressForm.addressLine1}
                        onChange={(e) => handleAddressInputChange('addressLine1', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Street address, P.O. box, company name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) => handleAddressInputChange('addressLine2', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => handleAddressInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => handleAddressInputChange('state', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={addressForm.zipCode}
                        onChange={(e) => handleAddressInputChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="ZIP code"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => handleAddressInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => handleAddressInputChange('isDefault', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
                      />
                      <label htmlFor="isDefault" className="ml-2 text-sm text-gray-300">
                        Set as default address
                      </label>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowAddressForm(false);
                          resetAddressForm();
                        }}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                      >
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAddresses.length === 0 ? (
                    <div className="text-center py-8">
                      <FaMapMarkerAlt className="text-gray-500 text-4xl mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No addresses saved yet</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-300"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    userAddresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                          selectedAddress === address.id
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-gray-600 hover:border-red-400'
                        }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-white">{address.fullName}</span>
                              {address.isDefault && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-gray-300 text-sm">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            {address.phone && (
                              <p className="text-gray-400 text-sm mt-1">Phone: {address.phone}</p>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address);
                              }}
                              className="text-gray-400 hover:text-white transition duration-300"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            {userAddresses.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition duration-300"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {!address.isDefault && (
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefaultAddress(address.id);
                              }}
                              className="text-xs text-gray-400 hover:text-white transition duration-300"
                            >
                              Set as default
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Payment Methods Section */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
              
              {/* Payment Method Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform ${
                      selectedMethod === method.id
                        ? 'border-red-500 bg-red-500/10 scale-105 shadow-lg'
                        : 'border-gray-600 hover:border-red-400 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedMethod === method.id ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300'
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{method.name}</h3>
                          <p className="text-xs text-gray-400">{method.description}</p>
                        </div>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Form */}
              <div className="border-t border-gray-700/50 pt-6">
                {selectedMethod === 'card' && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => handleCardInputChange('number', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        />
                        <div className="absolute right-3 top-3 flex space-x-2">
                          <SiVisa className="text-blue-400 text-xl" />
                          <SiMastercard className="text-red-400 text-xl" />
                          <FaRegCreditCard className="text-gray-400 text-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-800"
                      />
                      <label htmlFor="saveCard" className="ml-2 text-sm text-gray-300">
                        Save card for future purchases
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || !selectedAddress}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg transition duration-300 font-semibold border border-red-600 disabled:border-gray-600 flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        `Pay $${summary?.total || '0.00'}`
                      )}
                    </button>
                  </form>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="text-center">
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={isProcessing || !selectedAddress}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg transition duration-300 font-semibold flex items-center justify-center space-x-2 border border-blue-600 disabled:border-gray-600"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Redirecting...
                        </>
                      ) : (
                        <>
                          <FaPaypal className="text-xl" />
                          <span>Pay with PayPal</span>
                        </>
                      )}
                    </button>
                    <p className="text-sm text-gray-400 mt-3">
                      You will be redirected to PayPal to complete your payment
                    </p>
                  </div>
                )}

                {selectedMethod === 'apple' && (
                  <div className="text-center">
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={isProcessing || !selectedAddress}
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg transition duration-300 font-semibold flex items-center justify-center space-x-2 border border-gray-600 disabled:border-gray-600"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaApple className="text-xl" />
                          <span>Pay with Apple Pay</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedMethod === 'google' && (
                  <div className="text-center">
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={isProcessing || !selectedAddress}
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg transition duration-300 font-semibold flex items-center justify-center space-x-2 border border-gray-600 disabled:border-gray-600"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaGoogle className="text-xl text-green-400" />
                          <span>Pay with Google Pay</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Security Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-600/50 hover:border-red-500/30 transition duration-300">
                    <div className="text-red-500 mb-2 flex justify-center">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 sticky top-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image || '/api/placeholder/40/40'}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-700/50 pt-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>${summary?.subtotal || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax</span>
                  <span>${summary?.tax || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-700/50 pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-red-500">${summary?.total || '0.00'}</span>
                </div>
              </div>

              {/* Shipping Address Preview */}
              {selectedAddress && (
                <div className="border-t border-gray-700/50 pt-4 mb-4">
                  <h4 className="font-semibold text-white mb-2">Shipping to:</h4>
                  {(() => {
                    const address = userAddresses.find(addr => addr.id === selectedAddress);
                    return (
                      <div className="text-sm text-gray-300">
                        <p className="font-medium">{address.fullName}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Trust Badges */}
              <div className="border-t border-gray-700/50 pt-4">
                <div className="flex justify-center space-x-4 mb-3">
                  <SiStripe className="text-blue-400 text-2xl" />
                  <FaShieldAlt className="text-green-400 text-2xl" />
                  <FaLock className="text-red-500 text-2xl" />
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Your payment is secure and encrypted. We do not store your payment details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;