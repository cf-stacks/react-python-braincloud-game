import React, {Fragment} from "react";
import ReviewTable from "./ReviewTable";
import {CalendarData} from "../editor/CalendarData";

export default function Dashboard() {
    return (
      <Fragment>
        <div className="jumbotron p-3">
          <CalendarData />
        </div>
        <div className="jumbotron p-3">
          <ReviewTable />
        </div>
      </Fragment>
    )
};
