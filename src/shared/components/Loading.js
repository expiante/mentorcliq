import React from 'react';

// Load Vendors
import { useSelector } from 'react-redux';
import { addClass } from 'utils/appHelpers';

const Loading = ({ forceShow, isFixed }) => {
  const fetching = useSelector(state => state.fetching);

  if (!forceShow && !fetching) return null;

  return (
    <div className={`preloader${addClass(isFixed, 'is-fixed')}`}>
      <div className='sp sp-3balls' />
    </div>
  );
};

export default Loading;
