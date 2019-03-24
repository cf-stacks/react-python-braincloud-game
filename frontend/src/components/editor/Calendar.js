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
    'isoWeek': "dd D MMMM Y",
    'server': "Y-MM-DD",
  };

  static propTypes = {
    calendarData: PropTypes.object,
    objects: PropTypes.array.isRequired,
    statistics: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func,
    handleClickCell: PropTypes.func,
    handleRenderTotal: PropTypes.func,
    handleRenderCell: PropTypes.func,
    defaultRenderValue:PropTypes.any,
  };

  handleClickCell = e => {
    const element = e.target.closest('td');
    if (element) {
      const date = moment(parseInt(element.getAttribute('data-date')));
      const obj = element.getAttribute('data-object-id');
      if (this.props.handleClickCell) this.props.handleClickCell(e.target, obj, date.format(this.formats.server));
    }
  };

  handleRenderTotal = key => {
    const value = safeGet(this.props.statistics, `${key}`);
    if (value && this.props.handleRenderTotal) return this.props.handleRenderTotal(
      key, Object.keys(value).map(key => value[key])
    );
  };

  handleRenderCell = (obj, date) => {
    const value = safeGet(this.props.statistics, `${obj}.${date}`, this.props.defaultRenderValue);
    if (value && this.props.handleRenderCell) return this.props.handleRenderCell(obj, date, value)
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
    const layout = 'vertical'

    // Total Row
    let totalRow = <></>;
    if (this.props.handleRenderTotal) {
      totalRow = (
        <tr>
          <th className="text-center"><Trans>Total</Trans></th>
        { this.props.objects.map(obj => (
          <th key={obj.id} className="text-center">{this.handleRenderTotal(obj.id)}</th>
        ))}
        </tr>
      )
    }
    // Width of columns
    const colStyle = {
      width: `${(100 - 20) / this.props.objects.length}%`,
    };

    return (
      <Fragment>
        <div className="d-flex flex-row">
          <div className="d-flex flex-column p-2">
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateDate(this.props.calendarData.date.clone().subtract(1, this.props.calendarData.view))}
            >
              <i className="fas fa-angle-double-up"></i>
            </div>
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateView(new_view)}
            >
              { new_view === "month" ? <Trans>Month</Trans> : <Trans>Week</Trans> }
            </div>
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateDate(moment())}
            >
              <Trans>Today</Trans>
            </div>
            <div
              className="btn btn-outline-primary m-1"
              onClick={this.handleUpdateDate(this.props.calendarData.date.clone().add(1, this.props.calendarData.view))}
            >
              <i className="fas fa-angle-double-down"></i>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-striped table-hover-cell">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center" style={{width: "20%"}}>#</th>
                { this.props.objects.map(obj => (
                  <th key={obj.id} className="text-center" style={colStyle}>{obj.name}</th>
                ))}
                </tr>
                { totalRow }
              </thead>
              <tbody>
              { [...days].map(day => (
                <tr key={day} className={`text-center ${[6, 7].includes(day.isoWeekday()) ? "weekend" : ""}`}>
                  <th className="text-center">{day.format(this.formats['isoWeek'])}</th>
                { this.props.objects.map(obj => (
                  <td className="text-center" key={obj.id} onClick={this.handleClickCell} data-object-id={obj.id} data-date={day}>
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
    )
  }
}

export default Calendar;