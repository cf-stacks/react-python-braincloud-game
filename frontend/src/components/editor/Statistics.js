import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Trans } from "@lingui/macro";

import { Calendar } from "./Calendar";
import { changeCalendarData } from "../../actions/editor";

export class Statistics extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    statistics: PropTypes.object.isRequired,
    calendarData: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.changeCalendarData(this.props.calendarData.date, this.props.calendarData.view)
  }

  handleClickCell = (date, obj) => {
    console.log(date, obj)
  };

  handleRenderCell = value => {
    return (
      <div className="text-center">
        <span className="badge badge-primary px-2 mx-1">{ value.new ? value.new : ""}</span>
        <span className="badge badge-success px-2 mx-1">{ value.accepted ? value.accepted : ""}</span>
        <span className="badge badge-danger px-2 mx-1">{ value.rejected ? value.rejected : ""}</span>
      </div>
    )
  };

  render() {
    return (
      <Fragment>
        <Calendar
          objects={this.props.user.subordinates}
          statistics={this.props.statistics}
          calendarData={this.props.calendarData}
          changeCalendarData={this.props.changeCalendarData}
          handleClickCell={this.handleClickCell}
          handleRenderCell={this.handleRenderCell}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  statistics: state.editor.statistics,
  calendarData: state.editor.calendarData
});

export default connect(mapStateToProps, {changeCalendarData})(Statistics);