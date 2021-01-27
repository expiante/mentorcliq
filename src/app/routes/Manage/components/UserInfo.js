import React, { useEffect, useState } from 'react';

// Load Vendors
import { duplicate } from 'utils/appHelpers';
import { isEmail } from 'utils/formValidation';

// Load Components
import Input from 'shared/components/Input';
import Select from 'shared/components/Select';
import Checkbox from 'shared/components/Checkbox';
import Button from 'shared/components/Button';

// Load Consts
import { countries } from 'configs/consts';

const errorsDefaultForm = {
  first_name: '',
  last_name: '',
  email: '',
  city: '',
  country: '',
};

const UserInfo = ({ data, onSubmit }) => {
  const [form, setForm] = useState(() => duplicate(data));
  const [validationErrors, setVaidationErrors] = useState(() => duplicate(errorsDefaultForm));

  const checkFormValidation = () => {
    const newErrors = duplicate(errorsDefaultForm);
    let formIsValid = true;
    if (!form.first_name) {
      formIsValid = false;
      newErrors.first_name = 'First Name should not be empty!';
    }
    if (!form.last_name) {
      formIsValid = false;
      newErrors.last_name = 'Last Name should not be empty!';
    }
    if (!form.email) {
      formIsValid = false;
      newErrors.email = 'Email should not be empty!';
    }
    if (form.email && !isEmail(form.email)) {
      formIsValid = false;
      newErrors.email = 'Please enter a valid email!';
    }
    if (!form.city) {
      formIsValid = false;
      newErrors.city = 'Please specify the city!';
    }
    if (!form.country) {
      formIsValid = false;
      newErrors.country = 'Please specify the country!';
    }
    setVaidationErrors(newErrors);
    return formIsValid;
  };

  const handleChange = e => {
    const { name, value, checked, type } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationPassed = checkFormValidation();
    if (validationPassed) onSubmit(form);
  };

  useEffect(() => {
    setForm(data);
  }, [data]);

  return (
    <div className='card col-md-4 p-0 mx-auto'>
      <h5 className='card-header'>Basic Information</h5>
      <form onSubmit={handleSubmit}>
        <div className='card-body'>
          <Input
            type='text'
            name='first_name'
            label='First Name'
            className='mxw-100i'
            value={form.first_name}
            onChange={handleChange}
            error={validationErrors.first_name}
            autoFocus
          />
          <Input
            type='text'
            name='last_name'
            label='Last Name'
            className='mxw-100i'
            value={form.last_name}
            onChange={handleChange}
            error={validationErrors.last_name}
          />
          <Input
            type='text'
            name='email'
            label='Email'
            className='mxw-100i'
            value={form.email}
            onChange={handleChange}
            error={validationErrors.email}
          />
          <div className='form-group'>
            <label className='form-check-label'>Gender</label>
            <div className='d-flex'>
              <Checkbox
                id='male'
                value='0'
                name='gender'
                label='Male'
                checked={form.gender === '0'}
                onChange={handleChange}
                containerClass='mr-3'
              />
              <Checkbox
                id='female'
                value='1'
                name='gender'
                label='Female'
                checked={form.gender === '1'}
                onChange={handleChange}
              />
            </div>
          </div>
          <Input
            type='text'
            name='city'
            label='City'
            className='mxw-100i'
            value={form.city}
            onChange={handleChange}
            error={validationErrors.city}
          />
          <Select
            name='country'
            label='Country'
            className='mxw-100i'
            value={form.country}
            onChange={handleChange}
            error={validationErrors.country}
            items={countries}
            valueKey='name'
          />
        </div>
        <div className='text-right card-footer'>
          <Button size='lg' className='btn-primary'>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
