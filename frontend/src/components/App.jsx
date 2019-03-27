import React, { Component, Fragment } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Provider } from 'react-redux';
import store from '../store';

import LayoutContainer from './layout/Container';
import LayoutHeader from './layout/Header';
import LayoutAlert from './layout/Alert';
import AccountsLogin from './accounts/Login';
import CommonPrivateRoute from './common/PrivateRoute';
import { loadUser } from '../actions/auth';
import '../axios_config';
import '../moment_config';
import catalogRu from '../../locale/ru/messages';

const alertOptions = {
  timeout: 3000,
  position: 'bottom center',
};

const catalogs = { ru: catalogRu };
export const i18n = setupI18n({ catalogs, language: 'ru' });

class App extends Component {
  componentWillMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <AlertProvider template={AlertTemplate} {...alertOptions}>
            <Router>
              <Fragment>
                <LayoutHeader />
                <LayoutAlert />
                <main role="main" className="container">
                  <Switch>
                    <CommonPrivateRoute exact path="/" component={LayoutContainer} />
                    <Route exact path="/login" component={AccountsLogin} />
                  </Switch>
                </main>
              </Fragment>
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
