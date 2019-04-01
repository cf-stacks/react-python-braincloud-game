import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router';
import CalendarData from './CalendarData';
import QuestionForm from '../author/QuestionForm';
import AssignCategory from './AssignCategory';
import QuestionTable from './QuestionTable';
import QuestionCategoryTable from './QuestionCategoryTable';

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
          <QuestionCategoryTable />
        </Fragment>
      )}
    />
    <Route exact path="/quiz/question/:questionId" component={QuestionForm} />
  </Switch>
);

const Dashboard = IDashboard;
export default Dashboard;
