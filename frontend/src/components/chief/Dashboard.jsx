import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router';
import CalendarData from './CalendarData';
import PendingTable from './PendingTable';
import ActiveTable from './ActiveTable';
import QuestionForm from '../author/QuestionForm';

export const IDashboard = () => (
  <Switch>
    <Route
      exact
      path="/"
      component={() => (
        <Fragment>
          <CalendarData />
          <PendingTable />
          <ActiveTable />
        </Fragment>
      )}
    />
    <Route exact path="/question/:questionId" component={QuestionForm} />
  </Switch>
);

const Dashboard = IDashboard;
export default Dashboard;
