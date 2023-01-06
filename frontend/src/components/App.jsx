import React from 'react';
import {
  HashRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../store';

import ErrorBoundary from './layout/ErrorBoundary';
import Dashboard from './layout/Dashboard';
import GameApp from './layout/GameApp';
import Header from './layout/Header';
import Toaster from './layout/Toaster';
import NotFoundPage from './layout/NotFoundPage';
import ScrollToTop from './layout/ScrollToTop';
import Login from './accounts/Login';
// import PrivateRoute from './common/PrivateRoute';
import StaffRoute from './common/StaffRoute';
import { loadUser } from '../actions/auth';
import '../axios_config';
import '../moment_config';
import catalogRu from '../locale/ru/messages.po';
import '../css/Toasts.css';

toast.configure({
  autoClose: 5000,
  closeButton: false,
  draggable: false,
  style: {
    textAlign: 'center',
    width: '400px',
  },
});
const catalogs = { ru: catalogRu };
export const i18n = setupI18n({ catalogs, language: 'ru' });


class App extends React.Component {
  componentWillMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <Router>
            <ErrorBoundary>
              <ScrollToTop>
                <React.Fragment>
                  <Route path="*" component={Toaster} />
                  <Route path="*" component={Header} />
                  <main role="main" className="container">
                    <Switch>
                      <Route
                        exact
                        strict
                        path="/:url*"
                        render={props => <Redirect to={`${props.location.pathname}/`} />}
                      />
                      <Route exact path="/login/" component={Login} />
                      <Route exact path="/" component={GameApp} />
                      <StaffRoute path="/dashboard/" component={Dashboard} />
                      <Route component={NotFoundPage} />
                    </Switch>
                  </main>
                </React.Fragment>
              </ScrollToTop>
            </ErrorBoundary>
          </Router>
        </I18nProvider>
      </Provider>
    );
  }
}


const fApp = () => (
  <App />
);

export default fApp;
