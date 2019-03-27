import React, { Fragment } from 'react';
import { Statistics } from './Statistics';
import { QuestionForm } from './QuestionForm';
import { TodayList } from './TodayList';

export default function Dashboard() {
  return (
    <Fragment>
      <div className="jumbotron p-3">
        <Statistics />
      </div>
      {/*<div className="jumbotron p-3">*/}
        {/*<QuestionForm />*/}
      {/*</div>*/}
      {/*<div className="jumbotron p-3">*/}
        {/*<TodayList />*/}
      {/*</div>*/}
    </Fragment>
  );
}
