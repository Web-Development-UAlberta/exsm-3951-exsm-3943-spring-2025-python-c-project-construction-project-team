import React from 'react';
import '../../styles/button.css';

interface ButtonProps {
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
//   icon?: React.ReactNode;
//   iconPosition?: 'left' | 'right';
//   iconOnly?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  size = 'medium',
//   icon,
//   iconPosition = 'left',
//   iconOnly = false,
  className = '',
}) => {
  const buttonClassNames = `button button-${variant} button-${size} ${className}`;

  return (
    <button
      type={type}
      className={buttonClassNames}
      onClick={(event) => {
        event.preventDefault();
        if (!disabled && !loading) {
          onClick?.(event);
        }
      }}
      disabled={disabled || loading}
    >
      {/* {loading && <span className="spinner" role="status" aria-hidden="true"></span>}
      {!iconOnly && (
        <>
          {icon && iconPosition === 'left' && <span className="icon-left">{icon}</span>}
          {label}
          {icon && iconPosition === 'right' && <span className="icon-right">{icon}</span>}
        </>
      )}
        {iconOnly && <span className="icon-only">{icon}</span>} */}
        {label}
    </button>
  );
};

export default Button;