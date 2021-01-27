import React, { useEffect, useState, useCallback } from 'react';

// Load Apis
import { Api } from 'utils/connectors';

// Load Hooks
import { useSnackbar } from 'notistack';

// Load Components
import UserInfo from './components/UserInfo';
import EmploymentInfo from './components/EmploymentInfo';

const Manage = ({ match, history }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = match.params;

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    gender: '0',
    email: '',
    city: '',
    country: '',
    job_title: '',
    department: '',
  });

  const getData = useCallback(async () => {
    try {
      const { data } = await Api.get(`/Employeelist/${id}`);
      setData({ ...data, gender: String(data.gender) });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, id]);

  const handlePrevious = () => setStep(step - 1);

  const handleNext = data => {
    setData({ ...data });
    setStep(step + 1);
  };

  const handleSubmit = useCallback(async () => {
    try {
      const method = data.id ? 'put' : 'post';
      const URL = data.id ? `/Employeelist/${data.id}` : '/Employeelist';
      const response = await Api[method](URL, data);
      enqueueSnackbar(`The employee was successfully ${data.id ? 'updated' : 'created'}!`, {
        variant: 'success',
      });
      history.push(id ? `/profile/${id}` : `/employees/${response.data.id}`);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [data, enqueueSnackbar, history, id]);

  useEffect(() => {
    if (id) getData();
  }, [getData, id]);

  useEffect(() => {
    if (step === 2) handleSubmit();
  }, [handleSubmit, step]);

  const components = [
    <UserInfo data={data} onSubmit={handleNext} />,
    <EmploymentInfo data={data} onPrevious={handlePrevious} onSubmit={handleNext} />,
  ];

  return <div className='my-6'>{components[step]}</div>;
};

export default Manage;
