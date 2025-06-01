'use client';
import React, { useState } from 'react';
import { useCart, CartItem } from './cart-context';

export default function CartPopup() {
  const { cart, updateCartItem, removeFromCart, addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen((v) => !v);

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2);

  // Update color or size by removing old and adding new item with updated option
  function handleChangeOption(item: CartItem, field: 'color' | 'size', value: string) {
    removeFromCart(item.id, item.color, item.size);
    addToCart({
      ...item,
      [field]: value,
    });
  }

  return (
    <>
      <button
        onClick={togglePopup}
        className="fixed bottom-6 right-6 bg-pink-600 text-white px-5 py-3 rounded-full shadow-lg z-50 hover:bg-pink-700 transition"
      >
        Cart ({cart.length})
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 max-h-[70vh] overflow-auto bg-white rounded-xl shadow-2xl p-6 z-50">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {cart.length === 0 && <p className="text-gray-600">Cart is empty.</p>}

          {cart.map((item, idx) => (
            <div key={idx} className="mb-4 border-b pb-4 flex gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-grow">
                <p className="font-semibold">{item.title}</p>

                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={item.color}
                    onChange={(e) => handleChangeOption(item, 'color', e.target.value)}
                    className="border px-2 rounded w-20 text-sm"
                  />
                  <input
                    type="text"
                    value={item.size}
                    onChange={(e) => handleChangeOption(item, 'size', e.target.value)}
                    className="border px-2 rounded w-20 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateCartItem(item.id, item.color, item.size, {
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    className="px-2 bg-gray-200 rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartItem(item.id, item.color, item.size, {
                        quantity: item.quantity + 1,
                      })
                    }
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id, item.color, item.size)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <p className="text-right font-bold text-indigo-700 mt-4">Total: ${total}</p>

          <button
            onClick={() => (window.location.href = '/checkout')}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-3 rounded-xl shadow hover:scale-105 transition"
          >
            Go to Checkout
          </button>
        </div>
      )}
    </>
  );
}
