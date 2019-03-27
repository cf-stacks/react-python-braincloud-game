import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { getStatistics } from '../../actions/author';

export class Statistics extends Component {
  static propTypes = {
    statistics: PropTypes.object,
    getStatistics: PropTypes.func,
  };

  componentDidMount = () => {
    const { getStatistics: getStatisticsCall } = this.props;
    getStatisticsCall();
  }

  render() {
    const { statistics } = this.props;
    return (
      <Fragment>
        <h1 className="text-center"><Trans>Statistics</Trans></h1>
        <hr />
        <div className="d-flex d-flex flex-row justify-content-around">
          <div>
            <Trans>Total month</Trans>
            :
            {statistics.total_month}
          </div>
          <div>
            <Trans>Added today</Trans>
            :
            {statistics.total_today}
          </div>
          <div>
            <Trans>Accepted last shift</Trans>
            :
            {statistics.accepted_last_shift}
          </div>
          <div>
            <Trans>Rejected last shift</Trans>
            :
            {statistics.rejected_last_shift}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  statistics: state.author.statistics,
});

export default connect(mapStateToProps, { getStatistics })(Statistics);
