import React from 'react';

function Container({ children, className = '', size = 'default', ...props }) {
  const sizes = {
    small: 'max-w-4xl',
    default: 'max-w-6xl',
    large: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`container mx-auto px-1 py-1 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;