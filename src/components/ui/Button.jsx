import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  // Основные кнопки (фиолетовые)
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
  
  // Второстепенные (голубые)
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-md hover:shadow-lg',
  
  // Контурные (фиолетовая обводка)
  outlined: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300',
  
  // Для опасных действий (удаление, выход)
  danger: 'bg-danger hover:bg-red-600 text-white shadow-md hover:shadow-lg',
  
  // Для успешных действий (сохранить, подтвердить)
  success: 'bg-success hover:bg-green-600 text-white shadow-md hover:shadow-lg',
  
  // Для информационных действий (детали, просмотр)
  info: 'bg-info hover:bg-blue-600 text-white shadow-md hover:shadow-lg',
  
  // Светлая кнопка (для второстепенных действий на темном фоне)
  light: 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-md hover:shadow-lg',
  
  // Темная кнопка (для важных действий)
  dark: 'bg-gray-800 hover:bg-gray-900 text-white shadow-md hover:shadow-lg',
};

const sizes = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-6 py-2 text-base rounded-lg',
  lg: 'px-8 py-3 text-lg rounded-lg',
  xl: 'px-10 py-4 text-xl rounded-xl',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon,
  fullWidth = false,
  ...props
}) {
  const baseClasses = `
    ${variants[variant]} 
    ${sizes[size]} 
    inline-flex items-center justify-center 
    font-medium 
    transition-all duration-300 
    transform hover:scale-105 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;