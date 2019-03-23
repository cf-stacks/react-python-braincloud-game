import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import { Trans } from "@lingui/macro";
import moment from 'moment';
moment.locale('ru');

import { safeGet } from "../../utils/object_utils"
import "../../css/Calendar.css"



const getDays = (date, view) => {
  return moment.range(date.clone().startOf(view), date.clone().endOf(view)).by('days');
};

export class Calendar extends Component {

  formats = {
    'isoWeek': "ddd D MMM",
    'month': "DD/MM",
  };

  static propTypes = {
    calendarData: PropTypes.object,
    objects: PropTypes.array.isRequired,
    statistics: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func,
    handleClickCell: PropTypes.func,
    handleRenderTotal: PropTypes.func,
    handleRenderCell: PropTypes.func,
  };

  handleClickCell = e => {
    const date = moment(parseInt(e.target.getAttribute('data-date')));
    const obj = e.target.closest('td').getAttribute('data-object-id');
    if (this.props.handleClickCell) this.props.handleClickCell(date, obj);
  };

  handleRenderTotal = key => {
    const value = safeGet(this.props.statistics, `${key}`);
    if (value && this.props.handleRenderTotal) return this.props.handleRenderTotal(
      Object.keys(value).map(key => {
        return value[key]
      })
    );
  };

  handleRenderCell = (key1, key2) => {
    const value = safeGet(this.props.statistics, `${key1}.${key2}`);
    if (value && this.props.handleRenderCell) return this.props.handleRenderCell(value)
  };

  handleUpdateView = view => () => {
    this.props.changeCalendarData(this.props.calendarData.date, view)
  };

  handleUpdateDate = date => () => {
    this.props.changeCalendarData(date, this.props.calendarData.view);
  };

  render() {
    const days = getDays(this.props.calendarData.date, this.props.calendarData.view);
    const new_view = this.props.calendarData.view === "month"? "isoWeek": "month";
    return (
      <Fragment>
        <div className="row justify-content-center">
          <div
            className="btn btn-outline-primary"
            onClick={this.handleUpdateDate(this.props.calendarData.date.clone().subtract(1, this.props.calendarData.view))}
          >
            <i className="fas fa-angle-double-left"></i>
          </div>
          <div
            className="btn btn-outline-primary"
            onClick={this.handleUpdateView(new_view)}
          >
            { new_view === "month" ? <Trans>Month</Trans> : <Trans>Week</Trans> }
          </div>
          <div
            className="btn btn-outline-primary"
            onClick={this.handleUpdateDate(moment())}
          >
            <Trans>Today</Trans>
          </div>
          <div
            className="btn btn-outline-primary"
            onClick={this.handleUpdateDate(this.props.calendarData.date.clone().add(1, this.props.calendarData.view))}
          >
            <i className="fas fa-angle-double-right"></i>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-striped table-bordered table-hover-cell">
            <thead className="thead-dark">
              <tr>
                <th scope="col"><Trans>Author</Trans></th>
                <th scope="col"><Trans>Total</Trans></th>
              { [...days].map(day => (
                <th scope="col" key={day}>{day.format(this.formats[this.props.calendarData.view])}</th>
              ))}
              </tr>
            </thead>
            <tbody>
            { this.props.objects.map(obj => (
              <tr key={obj.id}>
                <th scope="row">{obj.name}</th>
                <td>{this.handleRenderTotal(obj.id)}</td>
              { [...days].map(day => (
                <td key={day} onClick={this.handleClickCell} data-object-id={obj.id} data-date={day}>
                  { this.handleRenderCell(obj.id, day.format("Y-MM-DD")) }
                </td>
              ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    )
  }
}

export default Calendar;