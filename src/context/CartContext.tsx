'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../components/ProductCard';

export interface CartItem {
  id: string; // unique item id (includes timestamp or config)
  product: Product;
  metal: string;
  size: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, config: { metal: string; size: string }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luxury_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('luxury_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Manage Toast duration
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (product: Product, config: { metal: string; size: string }) => {
    const newItem: CartItem = {
      id: `${product.id}-${config.metal}-${config.size}-${Date.now()}`,
      product,
      metal: config.metal,
      size: config.size
    };
    setCart((prev) => [...prev, newItem]);
    setToast(`✓ Added ${product.name} (Size ${config.size}) to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const showToast = (message: string) => {
    setToast(message);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, toast, showToast }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
export default CartContext;
