'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (
    id: number,
    color: string,
    size: string,
    updatedFields: Partial<CartItem>
  ) => void;
  removeFromCart: (id: number, color: string, size: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.color === newItem.color &&
          item.size === newItem.size
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const updateCartItem = (
    id: number,
    color: string,
    size: string,
    updatedFields: Partial<CartItem>
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.color === color && item.size === size) {
          return { ...item, ...updatedFields };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number, color: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.color === color && item.size === size))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
