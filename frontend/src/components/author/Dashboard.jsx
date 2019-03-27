import React, { Fragment } from 'react';
import IStatistics from './Statistics';
import IQuestionForm from './QuestionForm';
import ITodayList from './TodayList';

export default function Dashboard() {
  return (
    <Fragment>
      <div className="jumbotron p-3">
        <IStatistics />
      </div>
      <div className="jumbotron p-3">
        <IQuestionForm />
      </div>
      <div className="jumbotron p-3">
        <ITodayList />
      </div>
    </Fragment>
  );
}
