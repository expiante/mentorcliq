import React, { useEffect, useState, useCallback } from 'react';

// Load Apis
import { Api } from 'utils/connectors';

// Load Hooks
import { useSnackbar } from 'notistack';

// Load Components
import EmployeesList from './EmployeesList';
import GroupCreationModal from './GroupCreationModal';
import Input from 'shared/components/Input';
import Button from 'shared/components/Button';
import { duplicate } from 'utils/appHelpers';
import { Link } from 'react-router-dom';

// 1. Create group,
// 2. Get id from response,
// 3. loop through 5 selected employees, set group_id fro each member and GroupMembers wi

const GroupManaement = ({ data, groupId, onSubmit }) => {
  console.log(data);
  const { enqueueSnackbar } = useSnackbar();

  const [employees, setEmployees] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isGroupCreation, setIsGroupCreation] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupCreationData, setGroupCreationData] = useState(null);

  const getEmployeesList = useCallback(async () => {
    try {
      const { data } = await Api.get('/Employeelist');
      setEmployees(data);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const getGroup = useCallback(async () => {
    try {
      const { data } = await Api.get(`/Groups/${groupId}`);
      setIsGroupCreation(true);
      setGroupName(data.name);
      setSelectedMembers(data.employees);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, groupId]);

  const toggleMember = item => {
    let updatedMembers = duplicate(selectedMembers);
    let member = updatedMembers.find(member => member.id === item.id);
    if (member) {
      updatedMembers = updatedMembers.filter(member => member.id !== item.id);
    } else if (updatedMembers.length < 5) {
      updatedMembers.push(item);
    } else {
      enqueueSnackbar('You can select up to 5 employees.', { variant: 'info' });
    }
    setSelectedMembers(updatedMembers);
    if (isGroupCreation) setIsGroupCreation(false);
  };

  const prepareGroupCreation = e => {
    e.preventDefault();
    setGroupCreationData({
      name: groupName,
      owner_id: data.id,
      employees: selectedMembers,
      ...(groupId && { id: groupId }),
    });
  };

  const resetStates = () => {
    setGroupName('');
    setSelectedMembers([]);
    setIsGroupCreation(false);
    setGroupCreationData(null);
  };

  useEffect(() => {
    getEmployeesList();
  }, [getEmployeesList]);

  useEffect(() => {
    if (groupId) getGroup();
  }, [getGroup, groupId]);

  return (
    <>
      <div className='card col-md-10 p-0 mx-auto'>
        <h5 className='card-header'>Group Management</h5>
        <div className='p-3'>
          {!isGroupCreation && (
            <Button
              onClick={() => setIsGroupCreation(true)}
              className='btn-primary btn-lg mb-3'
              disabled={!selectedMembers.length}
            >
              {groupId ? 'Update' : 'Create'} Group
            </Button>
          )}
          {isGroupCreation && (
            <form onSubmit={prepareGroupCreation} className='mb-3'>
              <Input
                type='text'
                name='group_name'
                value={groupName}
                label='Group Name'
                onChange={e => setGroupName(e.target.value)}
                required
                autoFocus
              />
              <Button
                type='button'
                className='btn-outline-secondary mr-3'
                onClick={() => setIsGroupCreation(false)}
              >
                Cancel
              </Button>
              <Button>Submit</Button>
            </form>
          )}
          <p className='mb-0'>Select the employees with whom you want to create a group</p>
        </div>
        <div className='card-body p-0'>
          <EmployeesList
            data={employees}
            selectedMembers={selectedMembers}
            onSelectMember={toggleMember}
          />
        </div>
      </div>
      {groupCreationData && (
        <GroupCreationModal data={groupCreationData} onSubmit={onSubmit} onClose={resetStates} />
      )}
    </>
  );
};

export default GroupManaement;
