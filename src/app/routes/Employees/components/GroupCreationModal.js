import React, { useState, useEffect, useCallback } from 'react';

// Load Apis
import { Api } from 'utils/connectors';

// Load Hooks
import { useSnackbar } from 'notistack';

// Load Components
import DragSortableList from 'react-drag-sortable';
import Modal from 'shared/components/Modal';

const GroupCreationModal = ({ data, onClose, onSubmit }) => {
  const { enqueueSnackbar } = useSnackbar();

  const initialPriorities = data.employees.map(v => v.priority ?? v.id);

  const [tree, setTree] = useState(null);
  const [prioritizer, setPrioritizer] = useState(initialPriorities);

  const createGroup = async () => {
    data.employees = data.employees.map(item => {
      item.priority = prioritizer.indexOf(item.id);
      return item;
    });
    try {
      const method = data.id ? 'put' : 'post';
      const URL = data.id ? `/Groups/${data.id}` : '/Groups';
      await Api[method](URL, data);
      enqueueSnackbar(`Group successfully ${data.id ? 'updated' : 'created'}!`, {
        variant: 'success',
      });
      onSubmit();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const onSort = sorted => {
    const ids = sorted.map(v => v.content.props.id);
    setPrioritizer(ids);
  };

  const generateRecursiveDNDTree = useCallback(arr => {
    const list = [];

    arr.map(item => {
      list.push({
        content: (
          <div id={item.id} className='d-flex'>
            <div className='col-md-4 px-0'>
              <i className='fas fa-stream mr-1' /> {item.first_name} {item.last_name}
            </div>
            <div className='col-md-4 px-0'>{item.department}</div>
            <div className='col-md-4 px-0'>{item.job_title}</div>
          </div>
        ),
        classes: ['list-group-item drag-row'],
      });
    });

    return (
      <div className='list-group'>
        <DragSortableList
          items={list}
          placeholder={<div className='dnd-placeholder' />}
          onSort={onSort}
        />
      </div>
    );
  }, []);

  useEffect(() => {
    setTree(generateRecursiveDNDTree(data.employees));
  }, [data.employees, generateRecursiveDNDTree]);

  return (
    <Modal
      configs={{
        title: 'Group Creation',
        submitBtnText: 'Submit',
      }}
      size='lg'
      centered
      onClose={onClose}
      onSubmit={createGroup}
    >
      <p>Drag and drop to prioritize group members.</p>
      {tree}
    </Modal>
  );
};

export default GroupCreationModal;
