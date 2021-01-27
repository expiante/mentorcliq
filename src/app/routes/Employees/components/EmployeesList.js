import React from 'react';

// Load Components
import { Link } from 'react-router-dom';

// Load Consts
import { genders } from 'configs/consts';

const EmployeesList = ({ id, data, selectedMembers, onSelectMember }) => {
  const ids = selectedMembers.map(v => v.id);
  return (
    <table className='table table-hover'>
      <thead>
        <tr>
          <th scope='col'>#</th>
          <th scope='col'>First Name</th>
          <th scope='col'>Last Name</th>
          <th scope='col'>Gender</th>
          <th scope='col'>Department</th>
          <th scope='col'>Job Title</th>
          <th scope='col'>Country</th>
          <th scope='col'>City</th>
          {!id && <th scope='col'>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data &&
          !!data.length &&
          data.map(item => (
            <tr key={item.id} onClick={() => id && onSelectMember(item)}>
              <td>{ids.includes(item.id) && <i className='far fa-check-circle' />}</td>
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>{genders[item.gender]}</td>
              <td>{item.department}</td>
              <td>{item.job_title}</td>
              <td>{item.country}</td>
              <td>{item.city}</td>
              {!id && (
                <td>
                  <Link to={`/profile/${item.id}`} className='btn btn-primary btn-sm'>
                    View Profile
                  </Link>
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default EmployeesList;
