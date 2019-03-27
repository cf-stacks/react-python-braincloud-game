import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Calendar } from './Calendar';
import { changeCalendarData } from '../../actions/editor';

export class Statistics extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    statistics: PropTypes.object.isRequired,
    calendarData: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { changeCalendarData: changeCalendarDataCall, calendarData: { date, view } } = this.props;
    changeCalendarDataCall(date, view);
  }

  handleRenderCell = (obj, date, value) => (
    <div>
      <span className="badge badge-primary px-2 mx-1">{ value.new ? value.new : ''}</span>
      <span className="badge badge-success px-2 mx-1">{ value.accepted ? value.accepted : ''}</span>
      <span className="badge badge-danger px-2 mx-1">{ value.rejected ? value.rejected : ''}</span>
    </div>
  );

  handleRenderTotal = (obj, values) => {
    const value = values.reduce((a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
    return (
      this.handleRenderCell(obj, null, value)
    );
  };

  render() {
    const {
      user: { subordinates }, statistics, calendarData, changeCalendarData: changeCalendarDataCall,
    } = this.props;
    return (
      <Fragment>
        <Calendar
          objects={subordinates}
          statistics={statistics}
          calendarData={calendarData}
          changeCalendarData={changeCalendarDataCall}
          handleRenderTotal={this.handleRenderTotal}
          handleRenderCell={this.handleRenderCell}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  statistics: state.editor.statistics,
  calendarData: state.editor.calendarData,
});

export default connect(mapStateToProps, { changeCalendarData })(Statistics);
