import React from 'react';
import { Spinner } from 'react-bootstrap';

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  hover?: boolean;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean; // Can be used for other buttons but secondary since it is already outlined
  type?: 'button' | 'submit' ;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'link' | 'transparent';
  size?: 'sm' | 'lg';
  children?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  onClick,
  active = false,
  hover = false,
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  size,
  outline = false,
  children,
  iconPosition = 'left',
  iconOnly = false,
  className = '',
  ...rest
}) => {

  const getButtonClass = () => {
    let baseClass = '';

    if (variant === 'transparent') {
      baseClass = 'btn-transparent';
    }
    // Custom class for primary and secondary variants
    else if (variant === 'primary' || variant === 'secondary') {
      baseClass = outline ? `btn-custom-outline-${variant}` : `btn-custom-${variant}`;
    }
    else {
      baseClass = outline ? `btn-outline-${variant}` : `btn-${variant}`;
    }

    return baseClass;
  };

  const buttonClasses = [
    className,
    'btn',
    getButtonClass(),
    size ? `btn-${size}` : '', // Size class if specified
    active ? 'active' : '',
    hover ? 'hover' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {!iconOnly ? (
        <>
          {iconPosition === 'left' && children}
          {iconPosition === 'right' && children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;