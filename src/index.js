import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { snackbarSettings } from 'configs/consts';
import store from 'redux/store';
import 'scss/app.scss';
import Loading from 'shared/components/Loading';
import App from './app/App';

render(
  <Provider store={store}>
    <SnackbarProvider {...snackbarSettings}>
      <Suspense fallback={<Loading forceShow isFixed />}>
        <Router>
          <Switch>
            <Route path='/' component={App} />
          </Switch>
        </Router>
      </Suspense>
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root'),
);
