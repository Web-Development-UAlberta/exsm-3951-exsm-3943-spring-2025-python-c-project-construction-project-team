import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../../styles/Button.css';

interface ButtonProps {
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  hover?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' ;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  active = false,
  hover = false,
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  children,
  iconPosition = 'left',
  iconOnly = false,
  className = '',
}) => {
  const btnSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : undefined;
  
  const buttonClasses = [
    'btn',
    `btn-${variant}`,                     // Variant-specific class
    btnSize ? `btn-${btnSize}` : '', // Size class if specified
    active ? 'active' : '',
    hover ? 'hover' : '',
    className,                      // Additional custom classes
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
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
          {children && iconPosition === 'left' && (
            <span className="icon-left me-2">{children}</span>
          )}
          {label}
          {children && iconPosition === 'right' && (
            <span className="icon-right ms-2">{children}</span>
          )}
        </>
      ) : (
        <span className="icon-only">{children}</span>
      )}
    </button>
  );
};

export default Button;