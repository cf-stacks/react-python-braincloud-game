import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Provider } from 'react-redux';
import store from '../store';

import ErrorBoundary from './layout/ErrorBoundary';
import Dashboard from './layout/Dashboard';
import GameApp from './layout/GameApp';
import Header from './layout/Header';
import Alert from './layout/Alert';
import NotFoundPage from './layout/NotFoundPage';
import ScrollToTop from './layout/ScrollToTop';
import Login from './accounts/Login';
// import PrivateRoute from './common/PrivateRoute';
import StaffRoute from './common/StaffRoute';
import { loadUser } from '../actions/auth';
import '../axios_config';
import '../moment_config';
import catalogRu from '../locale/ru/messages';

const alertOptions = {
  timeout: 3000,
  position: 'bottom center',
};

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
          <AlertProvider template={AlertTemplate} {...alertOptions}>
            <Router>
              <ErrorBoundary>
                <ScrollToTop>
                  <React.Fragment>
                    <Route path="*" component={Header} />
                    <Route path="*" component={Alert} />
                    <main role="main" className="container">
                      <Switch>
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
          </AlertProvider>
        </I18nProvider>
      </Provider>
    );
  }
}


const fApp = () => (
  <App />
);

export default fApp;
