import React, { Fragment } from 'react';
import Statistics from './Statistics';
import QuestionForm from '../common/QuestionForm';
import TodayList from './TodayList';

export const IDashboard = () => (
  <Fragment>
    <QuestionForm />
    <Statistics />
    <TodayList />
  </Fragment>
);

const Dashboard = IDashboard;
export default Dashboard;
