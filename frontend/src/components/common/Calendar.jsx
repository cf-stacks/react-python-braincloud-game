import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import { safeGet } from '../../utils/object_utils';
import '../../css/Calendar.css';

const getDays = (date, view) => moment.range(date.clone().startOf(view), date.clone().endOf(view)).by('days');

export class ICalendar extends Component {
  static propTypes = {
    calendarData: PropTypes.object,
    objects: PropTypes.array.isRequired,
    statistics: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func,
    handleClickCell: PropTypes.func,
    handleRenderTotal: PropTypes.func,
    handleRenderCell: PropTypes.func,
    defaultRenderValue: PropTypes.any,
  };

  formats = {
    isoWeek: 'dd D MMMM Y',
    server: 'Y-MM-DD',
  };

  handleClickCell = (event) => {
    const { handleClickCell: handleClickCellCall } = this.props;
    const element = event.target.closest('td');
    if (element) {
      const date = moment(parseInt(element.getAttribute('data-date'), 10));
      const obj = element.getAttribute('data-object-id');
      if (handleClickCellCall) handleClickCellCall(event.target, obj, date.format(this.formats.server));
    }
  };

  handleRenderTotal = (key) => {
    const { statistics, handleRenderTotal: handleRenderTotalCall } = this.props;
    const value = safeGet(statistics, `${key}`);
    if (value && handleRenderTotalCall) {
      return handleRenderTotalCall(key, Object.keys(value).map(k => value[k]));
    }
    return null;
  };

  handleRenderCell = (obj, date) => {
    const { statistics, defaultRenderValue, handleRenderCell: handleRenderCellCall } = this.props;
    const value = safeGet(statistics, `${obj}.${date}`, defaultRenderValue);
    if (value && handleRenderCellCall) return handleRenderCellCall(obj, date, value);
    return null;
  };

  handleUpdateView = view => () => {
    const { changeCalendarData: changeCalendarDataCall, calendarData: { date } } = this.props;
    changeCalendarDataCall(date, view);
  };

  handleUpdateDate = date => () => {
    const { changeCalendarData: changeCalendarDataCall, calendarData: { view } } = this.props;
    changeCalendarDataCall(date, view);
  };

  render() {
    const { calendarData: { date, view }, objects, handleRenderTotal: handleRenderTotalCall } = this.props;
    const days = getDays(date, view);
    const newView = (view === 'month' ? 'isoWeek' : 'month');

    // Total Row
    let totalRow = <></>;
    if (handleRenderTotalCall) {
      totalRow = (
        <tr>
          <th className="text-center"><Trans>Total</Trans></th>
          { objects.map(obj => (
            <th key={obj.id} className="text-center">{this.handleRenderTotal(obj.id)}</th>
          ))}
        </tr>
      );
    }
    // Width of columns
    const colStyle = {
      width: `${(100 - 20) / objects.length}%`,
    };

    return (
      <Fragment>
        <div className="d-flex flex-row">
          <div className="d-flex flex-column p-2">
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateDate(date.clone().subtract(1, view))}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-angle-double-up" />
            </div>
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateView(newView)}
              role="button"
              tabIndex={0}
            >
              { newView === 'month' ? <Trans>Month</Trans> : <Trans>Week</Trans> }
            </div>
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateDate(moment())}
              role="button"
              tabIndex={0}
            >
              <Trans>Today</Trans>
            </div>
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateDate(date.clone().add(1, view))}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-angle-double-down" />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-striped table-hover-cell" role="grid">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center" style={{ width: '20%' }} role="gridcell">#</th>
                  { objects.map(obj => (
                    <th key={obj.id} className="text-center" style={colStyle} role="gridcell">{obj.name}</th>
                  ))}
                </tr>
                { totalRow }
              </thead>
              <tbody>
                { [...days].map(day => (
                  <tr key={day} className={`text-center ${[6, 7].includes(day.isoWeekday()) ? 'weekend' : ''}`}>
                    <th className="text-center" role="gridcell">{day.format(this.formats.isoWeek)}</th>
                    { objects.map(obj => (
                      <td
                        className="text-center"
                        key={obj.id}
                        onClick={this.handleClickCell}
                        data-object-id={obj.id}
                        data-date={day}
                        role="gridcell"
                      >
                        { this.handleRenderCell(obj.id, day.format(this.formats.server)) }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  }
}

const Calendar = ICalendar;
export default Calendar;
