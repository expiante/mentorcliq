import React, { useEffect, useState, useCallback } from 'react';

// Load Apis
import { Api } from 'utils/connectors';

// Load Hooks
import { useSnackbar } from 'notistack';

// Load Components
import UserInfo from './components/UserInfo';
import EmploymentInfo from './components/EmploymentInfo';
import GroupManaement from './components/GroupManaement';

const Employees = ({ match, history }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id, groupId } = match.params;

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

  const modifyData = data => {
    setData({ ...data, gender: String(data.gender) });
  };

  const getData = useCallback(async () => {
    try {
      const { data } = await Api.get(`/Employeelist/${id}`);
      modifyData(data);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, id]);

  const handlePrevious = () => setStep(step - 1);

  const handleNext = data => {
    setData({ ...data });
    setStep(step + 1);
  };

  // Navigate to user profile after registration
  const handleSubmit = () => history.push(`/profile/${data.id}`);

  useEffect(() => {
    if (id) getData();
  }, [getData, id]);

  useEffect(() => {
    if (groupId) setStep(2);
  }, [groupId]);

  const components = [
    <UserInfo data={data} onSubmit={handleNext} />,
    <EmploymentInfo data={data} onPrevious={handlePrevious} onSubmit={handleNext} />,
    <GroupManaement data={data} groupId={groupId} onSubmit={handleSubmit} />,
  ];

  return <div className='my-6'>{components[step]}</div>;
};

export default Employees;
