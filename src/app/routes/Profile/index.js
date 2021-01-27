import React, { useEffect, useState, useCallback } from 'react';

// Load Apis
import { Api } from 'utils/connectors';

// Load Hooks
import { useSnackbar } from 'notistack';

// Load Components
import { Link } from 'react-router-dom';

// Load Vendors
import { addClass } from 'utils/appHelpers';

// Load Consts
import { genders } from 'configs/consts';

const InfoRow = ({ name, value }) => (
  <tr>
    <th>{name}</th>
    <td>{value}</td>
  </tr>
);

const MemberRow = ({ data }) => (
  <tr>
    <td>
      {data.first_name} {data.last_name}
    </td>
    <td>{genders[data.gender]}</td>
    <td>{data.department}</td>
    <td>{data.job_title}</td>
  </tr>
);

const Profile = ({ match }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = match.params;

  const [data, setData] = useState(null);
  const [groups, setGroups] = useState(null);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await Api.get(`/Employeelist/${id}`);
      setData(data);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, id]);

  const getUserGroups = useCallback(async () => {
    try {
      const { data } = await Api.get('/Groups');
      const userGroups = data
        .filter(v => v.owner_id === id)
        .map(group => {
          group.employees = group.employees.sort((a, b) => a.priority - b.priority);
          return group;
        });
      setGroups(userGroups);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, id]);

  useEffect(() => {
    getUserInfo();
    getUserGroups();
  }, [getUserGroups, getUserInfo, id]);

  if (!data) return null;
  return (
    <div className='container-fluid my-6'>
      <h2 className='mb-4'>
        {data.first_name} {data.last_name}
      </h2>
      <div className='row'>
        <div className='col-md-4'>
          <h4>User Info</h4>
          <table className='table table-borderless'>
            <tbody>
              <InfoRow name='Gender' value={genders[data.gender]} />
              <InfoRow name='Email' value={data.email} />
              <InfoRow name='City' value={data.city} />
              <InfoRow name='Country' value={data.country} />
              <InfoRow name='Department' value={data.department} />
              <InfoRow name='Job Title' value={data.job_title} />
            </tbody>
          </table>
        </div>
        <div className='col-md-8'>
          <h4 className='mb-4'>User Groups</h4>
          {groups && !!groups.length ? (
            <div className='row'>
              <div className='col-3'>
                <div className='list-group'>
                  {groups &&
                    !!groups.length &&
                    groups.map((group, k) => (
                      <span
                        key={group.id}
                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between${addClass(
                          activeGroupIndex === k,
                          'active',
                        )}`}
                        onClick={() => setActiveGroupIndex(k)}
                        role='presentation'
                      >
                        {group.name} ({group.employees.length})
                        <Link
                          to={`/employees/${id}/${group.id}`}
                          className={`btn btn-sm text-${
                            activeGroupIndex === k ? 'white' : 'primary'
                          }`}
                        >
                          <i className='fas fa-pen' />
                        </Link>
                      </span>
                    ))}
                </div>
              </div>
              <div className='col-9'>
                <div className='tab-content' id='nav-tabContent'>
                  <div className='tab-pane fade show active'>
                    <table className='table table-borderless'>
                      <thead>
                        <tr>
                          <th>Full Name</th>
                          <th>Gender</th>
                          <th>Department</th>
                          <th>Job Title</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups[activeGroupIndex] &&
                          !!groups[activeGroupIndex].employees.length &&
                          groups[activeGroupIndex].employees.map(item => (
                            <MemberRow data={item} key={item.id} />
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>
              <i className='op-6'>No Groups</i>
            </p>
          )}
          <Link to={`/employees/${id}`} className='btn btn-primary primary mt-3'>
            <i className='fas fa-plus mr-1' /> Create new group
          </Link>
        </div>
      </div>
      <Link to={`/manage/${id}`} size='lg' className='btn btn-primary mt-6 mr-3'>
        <i className='fas fa-pen mr-2' />
        Edit Profile
      </Link>
      <Link to='/employees' size='lg' className='btn btn-primary mt-6'>
        <i className='fas fa-th-list mr-2' />
        View Employees List
      </Link>
    </div>
  );
};

export default Profile;
