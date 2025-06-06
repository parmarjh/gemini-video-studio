
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, isSelected = false }) => {
  const baseStyles = 'bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 ease-in-out';
  const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105' : '';
  const selectedStyles = isSelected ? 'ring-2 ring-sky-500 border-sky-500 scale-105 shadow-sky-glow' : 'border-transparent'; // Custom shadow for selected

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className} border-2`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {children}
    </div>
  );
};

// Add this to your index.html <style> tag or a Tailwind config if you have one for custom utilities
// (Since we can't have a separate CSS file, this is a note for how to achieve 'shadow-sky-glow')
/*
@layer utilities {
  .shadow-sky-glow {
    box-shadow: 0 0 15px 3px theme('colors.sky.500 / 50%');
  }
}
*/
// For now, the ring effect will serve as the primary visual indicator.

export default Card;
