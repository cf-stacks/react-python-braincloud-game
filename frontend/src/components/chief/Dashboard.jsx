import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router';
import CalendarData from './CalendarData';
import QuestionForm from '../author/QuestionForm';
import AssignCategory from './AssignCategory';
import QuestionTable from './QuestionTable';

export const IDashboard = () => (
  <Switch>
    <Route
      exact
      path="/"
      component={() => (
        <Fragment>
          <CalendarData />
          <AssignCategory />
          <QuestionTable />
        </Fragment>
      )}
    />
    <Route exact path="/question/:questionId" component={QuestionForm} />
  </Switch>
);

const Dashboard = IDashboard;
export default Dashboard;
