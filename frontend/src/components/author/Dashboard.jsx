import React from 'react';
import { Route, Switch } from 'react-router';
import Statistics from './Statistics';
import QuestionForm from '../common/QuestionForm';
import TodayList from './TodayList';
import NotFoundPage from '../layout/NotFoundPage';

export const IDashboard = ({ match }) => (
  <Switch>
    <Route
      exact
      path={match.path}
      component={() => (
        <React.Fragment>
          <QuestionForm />
          <Statistics />
          <TodayList />
        </React.Fragment>
      )}
    />
    <Route component={NotFoundPage} />
  </Switch>

);

const Dashboard = IDashboard;
export default Dashboard;
