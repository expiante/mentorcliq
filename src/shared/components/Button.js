import React from 'react';

// Load Vendors
import { addClass } from 'utils/appHelpers';

const Button = ({
  type = 'submit',
  size = 'md',
  className = 'btn-primary',
  children,
  onClick,
  disabled = false,
}) => (
  <button
    type={type}
    className={`btn btn-${size}${addClass(className, className)}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
