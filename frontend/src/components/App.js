import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { I18nProvider } from '@lingui/react'

import Container from "./layout/Container";
import Header from "./layout/Header";
import Alert from "./layout/Alert";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import PrivateRoute from "./common/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/auth";
import "../axios_config";

const alertOptions = {
  timeout: 1000,
  position: "bottom center"
};

import catalogRu from '../../locale/ru/messages.js'
const catalogs = { ru: catalogRu };

class App extends Component {

  componentWillMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <I18nProvider language="ru" catalogs={catalogs}>
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

ReactDOM.render(<App />, document.getElementById('app'));
