// Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice 
  } = useCart();

  const handleClearCart = () => {
    if (cart.length > 0 && window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-900 rounded-lg shadow-md p-12 text-center border border-gray-800">
            <ShoppingCartIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Start adding some games to your cart!</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 border border-red-600"
            >
              Browse Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-400 transition duration-300 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
          {cart.map(item => (
            <div key={item.id} className="border-b border-gray-800 last:border-b-0">
              <div className="p-6 flex items-center space-x-4">
                <img
                  src={item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.genre}</p>
                  <p className="text-lg font-bold text-white">${item.price}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-800 transition duration-300 border border-gray-700 text-white"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-800 transition duration-300 border border-gray-700 text-white"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-900 rounded-lg transition duration-300 border border-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg shadow-md p-6 mt-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-white">Total:</span>
            <span className="text-2xl font-bold text-white">${getTotalPrice().toFixed(2)}</span>
          </div>
          <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300 font-semibold border border-red-600">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;