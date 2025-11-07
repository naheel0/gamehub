import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckBadgeIcon,
  ShoppingBagIcon,
  HomeIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { 
  CheckBadgeIcon as CheckBadgeSolid,
  ShoppingBagIcon as ShoppingBagSolid 
} from '@heroicons/react/24/solid';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Get order data from navigation state or localStorage
    const orderData = location.state?.order || JSON.parse(localStorage.getItem('lastOrder'));
    
    if (orderData) {
      setOrder(orderData);
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      // Clear cart after successful order
      if (location.state?.fromCart) {
        clearCart();
      }
    } else {
      // Redirect to home if no order data
      navigate('/');
    }
    
    setLoading(false);
  }, [location, navigate, clearCart]);

  useEffect(() => {
    if (order) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-center">
            <div className="h-24 w-24 bg-green-800 rounded-full mx-auto mb-6"></div>
            <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
            <p className="text-gray-400 mb-6">We couldn't find your order details.</p>
            <Link
              to="/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'card':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'paypal':
        return 'PP';
      case 'crypto':
        return '₿';
      default:
        return <CreditCardIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <CheckBadgeSolid className="h-24 w-24 text-green-400 relative z-10 mx-auto mb-6" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-green-400 mb-2">
            Thank you for your purchase, {user?.name}!
          </p>
          <p className="text-gray-400">
            Your order has been successfully processed and your games are ready to play.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mb-8">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Order #{order.id.slice(-8).toUpperCase()}</h2>
                <p className="text-green-100 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formatDate(order.date)}
                </p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 mt-4 sm:mt-0">
                <span className="text-white font-semibold text-lg">
                  ${order.summary.total}
                </span>
              </div>
            </div>
          </div>

          {/* Order Content */}
          <div className="p-6">
            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ShoppingBagSolid className="h-5 w-5 mr-2 text-green-400" />
                Games Purchased ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-green-500/30 transition duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || '/api/placeholder/60/60'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${item.price}</p>
                      <p className="text-green-400 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment & Delivery Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-400">Status</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Completed
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-400 flex items-center">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      {getPaymentMethodIcon(order.paymentMethod)}
                    </span>
                    <span className="text-white font-semibold capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-400 flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Delivery
                    </span>
                    <span className="text-green-400 font-semibold">Instant Digital</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Cost Summary</h3>
                <div className="space-y-2 bg-gray-700/30 rounded-lg p-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${order.summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${order.summary.tax}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total</span>
                      <span className="text-green-400">${order.summary.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            What's Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-green-500/30 transition duration-300">
              <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <EnvelopeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Check Your Email</h4>
              <p className="text-gray-400 text-sm">
                We've sent download links and installation instructions to your email.
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-green-500/30 transition duration-300">
              <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserIcon className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Access Your Library</h4>
              <p className="text-gray-400 text-sm">
                Your games are now available in your personal game library.
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-green-500/30 transition duration-300">
              <div className="bg-orange-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBagIcon className="h-6 w-6 text-orange-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Need Help?</h4>
              <p className="text-gray-400 text-sm">
                Visit our support center for installation help or technical issues.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center font-semibold"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          
          <Link
            to="/"
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg transition duration-300 flex items-center justify-center font-semibold"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Home
            {countdown > 0 && (
              <span className="ml-2 bg-gray-600 px-2 py-1 rounded text-xs">
                {countdown}s
              </span>
            )}
          </Link>
          
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition duration-300 flex items-center justify-center font-semibold"
          >
            Print Receipt
          </button>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm">
            Need assistance? <Link to="/contact" className="text-green-400 hover:text-green-300">Contact our support team</Link> • 
            Order confirmation sent to: <span className="text-white">{user?.email}</span>
          </p>
        </div>
      </div>

      {/* Confetti Effect (CSS-based) */}
      <style jsx>{`
        @keyframes confettiFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #10B981;
          animation: confettiFall 3s linear forwards;
          z-index: 1000;
        }
        
        .confetti:nth-child(2n) { background: #EF4444; }
        .confetti:nth-child(3n) { background: #3B82F6; }
        .confetti:nth-child(4n) { background: #F59E0B; }
        .confetti:nth-child(5n) { background: #8B5CF6; }
      `}</style>
      
      {/* Generate confetti */}
      {typeof window !== 'undefined' && 
        Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))
      }
    </div>
  );
};

export default OrderConfirmation;