import React from 'react';

// Load Vendors
import { addClass } from 'utils/appHelpers';

const Input = ({
  type,
  name,
  value,
  onChange,
  error,
  label,
  containerClass = '',
  className = '',
  required = false,
  disabled = false,
  autoFocus = false,
}) => (
  <div className={`form-group${addClass(containerClass, containerClass)}`}>
    {label && (
      <label htmlFor={name}>
        {label} {required && <span className='text-danger'>*</span>}
      </label>
    )}
    <input
      type={type}
      id={name}
      name={name}
      className={`form-control${addClass(className, className)}${addClass(error, 'is-invalid')}`}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      autoFocus={autoFocus}
    />
    {error && <p className='text-danger text-sm mb-0 px-3'>{error}</p>}
  </div>
);

export default Input;
