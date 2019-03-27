import React, { Fragment } from 'react';
import EditorReviewTable from './ReviewTable';
import EditorCalendarData from './CalendarData';

function Dashboard() {
  return (
    <Fragment>
      <div className="jumbotron p-3">
        <EditorCalendarData />
      </div>
      <div className="jumbotron p-3">
        <EditorReviewTable />
      </div>
    </Fragment>
  );
}

export default Dashboard;
