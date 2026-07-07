import React from 'react';
import './components.css';

interface BadgeProps {
  type: 'verified' | 'alert' | 'ai' | 'featured';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, children, className = '' }) => {
  return (
    <span className={`badge badge-${type} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
