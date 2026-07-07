'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2 } from 'lucide-react';
import './components.css';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className="toast toast-enter">
        <CheckCircle2 size={16} className="toast-success-icon" />
        <span>{toast}</span>
      </div>
    </div>
  );
};
export default Toast;
