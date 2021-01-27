import React, { lazy } from 'react';

// Load Vendors
import { Switch, Route, Redirect } from 'react-router-dom';

// Load Components
import Loading from 'shared/components/Loading';

// Load Routes
const Profile = lazy(() => import('./routes/Profile'));
const Employees = lazy(() => import('./routes/Employees'));

const App = () => (
  <main>
    <Switch>
      <Route path='/profile/:id' component={Profile} />
      <Route path='/employees/:id?/:groupId?' component={Employees} />
      <Redirect from='*' to='/employees' />
    </Switch>
    <Loading />
  </main>
);

export default App;
