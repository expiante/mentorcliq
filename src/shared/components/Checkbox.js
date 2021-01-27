import React from 'react';

// Load Vendors
import { addClass } from 'utils/appHelpers';

const Checkbox = ({ name, id, value, checked, onChange, label, containerClass = '' }) => (
  <div className={`form-check${addClass(containerClass, containerClass)}`}>
    <input
      className='form-check-input'
      type='radio'
      name={name}
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label && (
      <label className='form-check-label' htmlFor={id}>
        {label}
      </label>
    )}
  </div>
);

export default Checkbox;
