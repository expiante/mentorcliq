import React, { useState } from 'react';

// Load Apis
import { Api } from 'utils/connectors';

// Load Hooks
import { useSnackbar } from 'notistack';

// Load Vendors
import { duplicate } from 'utils/appHelpers';

// Load Components
import Input from 'shared/components/Input';
import Select from 'shared/components/Select';
import Button from 'shared/components/Button';

// Load Consts
import { departments } from 'configs/consts';

const errorsDefaultForm = {
  job_title: '',
  department: '',
};

const EmploymentInfo = ({ data, onPrevious, onSubmit }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState(() => duplicate(data));
  const [validationErrors, setVaidationErrors] = useState(() => duplicate(errorsDefaultForm));

  const checkFormValidation = () => {
    const newErrors = duplicate(errorsDefaultForm);
    let formIsValid = true;
    if (!form.job_title) {
      formIsValid = false;
      newErrors.job_title = 'Job Title should not be empty!';
    }
    if (!form.department) {
      formIsValid = false;
      newErrors.department = 'Please specify the department!';
    }
    setVaidationErrors(newErrors);
    return formIsValid;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationPassed = checkFormValidation();
    if (!validationPassed) return;
    try {
      const method = form.id ? 'put' : 'post';
      const URL = form.id ? `/Employeelist/${form.id}` : '/Employeelist';
      const { data } = await Api[method](URL, form);
      onSubmit(data);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <div className='card col-md-4 p-0 mx-auto'>
      <h5 className='card-header'>Employment Information</h5>
      <form onSubmit={handleSubmit}>
        <div className='card-body'>
          <Input
            type='text'
            name='job_title'
            label='Job Title'
            className='mxw-100i'
            value={form.job_title}
            onChange={handleChange}
            error={validationErrors.job_title}
            autoFocus
          />
          <Select
            name='department'
            label='Department'
            className='mxw-100i'
            value={form.department}
            onChange={handleChange}
            valueKey='key'
            error={validationErrors.department}
            items={departments}
          />
        </div>
        <div className='card-footer d-flex justify-content-between'>
          <Button type='button' size='lg' className='btn-outline-secondary' onClick={onPrevious}>
            Back
          </Button>
          <Button size='lg' className='btn-primary'>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmploymentInfo;
