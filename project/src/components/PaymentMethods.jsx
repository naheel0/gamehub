import React, { useState } from 'react';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaApple, 
  FaGoogle, 
  FaShieldAlt, 
  FaLock,
  FaCheckCircle,
  FaRegCreditCard
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiStripe } from 'react-icons/si';

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [saveCard, setSaveCard] = useState(false);

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

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert('Payment processed successfully!');
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Payment Methods</h1>
          <p className="text-lg text-gray-300">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods Selection */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Select Payment Method</h2>
              
              {/* Payment Method Options */}
              <div className="space-y-4 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition duration-300 ${
                      selectedMethod === method.id
                        ? 'border-red-600 bg-red-900 bg-opacity-20'
                        : 'border-gray-700 hover:border-red-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          selectedMethod === method.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{method.name}</h3>
                          <p className="text-sm text-gray-400">{method.description}</p>
                        </div>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Supported Methods */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {method.supported.map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Form */}
              <div className="border-t border-gray-700 pt-6">
                {selectedMethod === 'card' && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                          maxLength="19"
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
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                          maxLength="3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
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
                      className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 font-semibold border border-red-600"
                    >
                      Pay Now
                    </button>
                  </form>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="text-center">
                    <button
                      onClick={handlePaymentSubmit}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold flex items-center justify-center space-x-2 border border-blue-600"
                    >
                      <FaPaypal className="text-xl" />
                      <span>Pay with PayPal</span>
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
                      className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300 font-semibold flex items-center justify-center space-x-2 border border-gray-700"
                    >
                      <FaApple className="text-xl" />
                      <span>Pay with Apple Pay</span>
                    </button>
                  </div>
                )}

                {selectedMethod === 'google' && (
                  <div className="text-center">
                    <button
                      onClick={handlePaymentSubmit}
                      className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300 font-semibold flex items-center justify-center space-x-2 border border-gray-700"
                    >
                      <FaGoogle className="text-xl text-green-400" />
                      <span>Pay with Google Pay</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Security Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
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
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 sticky top-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
              
              {/* Sample Order Items */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Elden Ring</span>
                  <span className="font-semibold text-white">$59.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cyberpunk 2077</span>
                  <span className="font-semibold text-white">$39.99</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax</span>
                  <span>$8.00</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-red-500">$107.98</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-center space-x-4 mb-4">
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

        {/* Additional Info */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-8 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Payment Issues</h4>
              <p className="text-gray-400 text-sm">
                If you're experiencing issues with payment, please check your card details 
                or try a different payment method.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Contact Support</h4>
              <p className="text-gray-400 text-sm">
                Our support team is available 24/7 to help with any payment-related questions.
              </p>
              <button className="mt-2 text-red-500 hover:text-red-400 text-sm font-semibold">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;