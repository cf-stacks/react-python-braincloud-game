import React, {Fragment} from "react";
import Statistics from "./Statistics"
import QuestionForm from "./QuestionForm";
import TodayList from "./TodayList";

export default function Dashboard() {
    return (
      <Fragment>
        <Statistics/>
        <QuestionForm/>
        <TodayList/>
      </Fragment>
    )
}
