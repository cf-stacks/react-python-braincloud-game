import React, { Fragment } from 'react';
import IReviewTable from './ReviewTable';
import CalendarData from './CalendarData';

export default function Dashboard() {
  return (
    <Fragment>
      <div className="jumbotron p-3">
        <CalendarData />
      </div>
      <div className="jumbotron p-3">
        <IReviewTable />
      </div>
    </Fragment>
  );
}
