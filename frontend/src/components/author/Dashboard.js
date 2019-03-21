import React, {Component, Fragment} from "react";
import Statistics from "./Statistics"
import QuestionForm from "./QuestionForm";
import TodayList from "./TodayList";
import {connect} from "react-redux";
import {getCategories} from "../../actions/author";
import PropTypes from "prop-types";


export class Dashboard extends Component {

  static propTypes = {
    getCategories: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getCategories();
  }

  render() {
    return (
      <Fragment>
        <Statistics/>
        <QuestionForm/>
        <TodayList/>
      </Fragment>
    )
  }
}

export default connect(null, { getCategories })(Dashboard);