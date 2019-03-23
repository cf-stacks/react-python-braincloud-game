import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Trans } from "@lingui/macro";

import { Calendar } from "./Calendar";
import { changeCalendarData } from "../../actions/editor";
import {createMessage} from "../../actions/messages";

export class Categories extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    assignedCategories: PropTypes.object.isRequired,
    calendarData: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.changeCalendarData(this.props.calendarData.date, this.props.calendarData.view)
  }

  handleClickCell = (date, obj) => {
    console.log(date, obj);
  };

  handleRenderCell = value => {
    return (
      <div className="text-center">
        { value.map(val => (
          <span key={val} className="badge badge-secondary">{val}</span>
        ))}
      </div>
    )
  };

  render() {
    return (
      <Fragment>
        <Calendar
          objects={this.props.user.subordinates}
          statistics={this.props.assignedCategories}
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
  assignedCategories: state.editor.assignedCategories,
  calendarData: state.editor.calendarData
});

export default connect(mapStateToProps, {changeCalendarData, createMessage})(Categories);