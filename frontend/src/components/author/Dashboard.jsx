import React, { Fragment } from 'react';
import AuthorStatistics from './Statistics';
import AuthorQuestionForm from './QuestionForm';
import AuthorTodayList from './TodayList';

export default function Dashboard() {
  return (
    <Fragment>
      <div className="jumbotron p-3">
        <AuthorStatistics />
      </div>
      <div className="jumbotron p-3">
        <AuthorQuestionForm />
      </div>
      <div className="jumbotron p-3">
        <AuthorTodayList />
      </div>
    </Fragment>
  );
}
