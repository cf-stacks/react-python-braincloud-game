import React from 'react';
import { Route, Switch } from 'react-router';
import EditorReviewTable from './ReviewTable';
import EditorCalendarData from './CalendarData';
import QuestionForm from '../common/QuestionForm';
import NotFoundPage from '../layout/NotFoundPage';

export const IDashboard = ({ match }) => (
  <Switch>
    <Route
      exact
      path={match.path}
      component={() => (
        <React.Fragment>
          <EditorCalendarData />
          <EditorReviewTable />
        </React.Fragment>
      )}
    />
    <Route exact path={`${match.path}/quiz/question/:questionId`} component={QuestionForm} />
    <Route component={NotFoundPage} />
  </Switch>
);

const Dashboard = IDashboard;
export default Dashboard;
