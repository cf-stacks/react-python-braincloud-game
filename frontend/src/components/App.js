import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { setupI18n } from "@lingui/core"
import { I18nProvider } from '@lingui/react'

import Container from "./layout/Container";
import Header from "./layout/Header";
import Alert from "./layout/Alert";
import Login from "./accounts/Login";
import PrivateRoute from "./common/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/auth";
import "../axios_config";
import "../moment_config";

const alertOptions = {
  timeout: 3000,
  position: "bottom center"
};

import catalogRu from '../../locale/ru/messages.js'
const catalogs = { ru: catalogRu };
export const i18n = setupI18n({catalogs, language: "ru"});

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
                <Header />
                <Alert />
                <main role="main" className="container">
                  <Switch>
                    <PrivateRoute exact path="/" component={Container} />
                    <Route exact path="/login" component={Login} />
                  </Switch>
                </main>
              </Fragment>
            </Router>
          </AlertProvider>
        </I18nProvider>
      </Provider>
    )
  }
}

const fApp = () => {
  return (
    <App />
  )
};

export default fApp;
