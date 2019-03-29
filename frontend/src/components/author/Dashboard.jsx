import React, { Fragment } from 'react';
import AuthorStatistics from './Statistics';
import AuthorQuestionForm from './QuestionForm';
import AuthorTodayList from './TodayList';

export default function Dashboard() {
  return (
    <Fragment>
      <AuthorQuestionForm />
      <AuthorStatistics />
      <AuthorTodayList />
    </Fragment>
  );
}
