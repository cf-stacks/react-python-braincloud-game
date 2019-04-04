import React from 'react';
import { Route, Switch } from 'react-router';
import CalendarData from './CalendarData';
import QuestionForm from '../common/QuestionForm';
import AssignCategory from './AssignCategory';
import QuestionTable from './QuestionTable';
import QuestionCategoryTable from './QuestionCategoryTable';
import NotFoundPage from '../layout/NotFoundPage';

export const IDashboard = ({ match }) => (
  <Switch>
    <Route
      exact
      path={match.path}
      component={() => (
        <React.Fragment>
          <CalendarData />
          <AssignCategory />
          <QuestionTable />
          <QuestionCategoryTable />
        </React.Fragment>
      )}
    />
    <Route exact path={`${match.path}/quiz/question/:questionId`} component={QuestionForm} />
    <Route component={NotFoundPage} />
  </Switch>
);

const Dashboard = IDashboard;
export default Dashboard;
