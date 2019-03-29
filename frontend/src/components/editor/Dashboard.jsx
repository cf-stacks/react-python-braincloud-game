import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router';
import EditorReviewTable from './ReviewTable';
import EditorCalendarData from './CalendarData';
import QuestionForm from '../author/QuestionForm';

export const IDashboard = () => (
  <Switch>
    <Route
      exact
      path="/"
      component={() => (
        <Fragment>
          <EditorCalendarData />
          <EditorReviewTable />
        </Fragment>
      )}
    />
    <Route exact path="/question/:questionId" component={QuestionForm} />
  </Switch>
);

const Dashboard = IDashboard;
export default Dashboard;
