import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-lg',
  };

  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner size="sm" />
          <span className="ml-2">{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 