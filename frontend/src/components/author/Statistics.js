import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getStatistics } from "../../actions/author";
import { Trans } from "@lingui/macro";

export class Statistics extends Component {
  static propTypes = {
    statistics: PropTypes.object.isRequired,
    getStatistics: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getStatistics();
  }

  render () {
    return (
      <Fragment>
        <h1 className="text-center"><Trans>Statistics</Trans></h1>
        <hr/>
        <div className="d-flex d-flex flex-row justify-content-around">
          <div><Trans>Total month</Trans>: {this.props.statistics.total_month}</div>
          <div><Trans>Added today</Trans>: {this.props.statistics.total_today}</div>
          <div><Trans>Accepted last shift</Trans>: {this.props.statistics.accepted_last_shift}</div>
          <div><Trans>Rejected last shift</Trans>: {this.props.statistics.rejected_last_shift}</div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  statistics: state.author.statistics
});

export default connect(mapStateToProps, { getStatistics })(Statistics);
