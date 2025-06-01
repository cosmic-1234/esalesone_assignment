'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CartItem {
  id: number;
  title: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateLocalStorage = (newCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    updateLocalStorage(updated);
  };

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    updateLocalStorage(updated);
  };

  const goToCheckout = () => {
    window.location.href = '/checkout';
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-indigo-50 to-yellow-50 py-16 px-6">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-600 drop-shadow mb-12">
        🛒 Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">Your cart is empty.</div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center gap-6 mb-6">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-xl shadow" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">Color: {item.color} | Size: {item.size}</p>
                <p className="text-sm text-gray-600 mt-1">Price: ${item.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l text-xl"
                  >−</button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r text-xl"
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-bold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(index)}
                  className="mt-2 text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <hr className="my-6" />
          <div className="text-right text-xl font-bold text-indigo-700">
            Total: ${total}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={goToCheckout}
              className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3 rounded-full shadow hover:scale-105 transition"
            >
              Proceed to Checkout 💳
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
