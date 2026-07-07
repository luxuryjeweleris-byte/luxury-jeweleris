'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CartCheckoutView from '../../views/CartCheckoutView';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();

  const handleNavigate = (view: string) => {
    if (view === 'listing') {
      router.push('/diamonds');
    } else {
      router.push('/');
    }
  };

  return (
    <CartCheckoutView 
      cart={cart} 
      onRemoveItem={removeFromCart} 
      onClearCart={clearCart} 
      onNavigate={handleNavigate} 
    />
  );
}
