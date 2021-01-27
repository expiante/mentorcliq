import React from 'react';

// Load Vendors
import { addClass } from 'utils/appHelpers';

const Select = ({
  name,
  value,
  onChange,
  error,
  label,
  containerClass = '',
  className = '',
  items,
  required = false,
  disabled = false,
  autoFocus = false,
  valueKey = 'id',
  viewKey = 'name',
}) => {
  return (
    <div className={`form-group${addClass(containerClass, containerClass)}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className='text-danger'>*</span>}
        </label>
      )}
      <select
        className={`form-control${addClass(className, className)}${addClass(error, 'is-invalid')}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
      >
        <option value=''>Select</option>
        {items &&
          !!items.length &&
          items.map(loc => (
            <option key={loc[valueKey]} value={loc[valueKey]}>
              {loc[viewKey]}
            </option>
          ))}
      </select>
      {error && <p className='text-danger text-sm mb-0 px-3'>{error}</p>}
    </div>
  );
};

export default Select;
