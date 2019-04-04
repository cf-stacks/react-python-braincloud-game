import React from 'react';
import { t } from '@lingui/macro';
import { HashRouter as Router, Route } from 'react-router-dom';

import Header from './Header';
import ErrorPage from './ErrorPage';
import { i18n } from '../App';


export const IServerErrorPage = (props) => (
  <Router>
    <React.Fragment>
      <Route path="*" component={Header} />
        <Route
          path="*"
          component={() => (
            <main role="main" className="container">
              <ErrorPage title={i18n._(t`Server error happened. Report to developer!`)} code="500" {...props} />
            </main>
          )}
        />
    </React.Fragment>
  </Router>
);

const ServerErrorPage = IServerErrorPage;
export default ServerErrorPage;
