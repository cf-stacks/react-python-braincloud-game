import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getStatistics } from "../../actions/author";
import { Trans } from "@lingui/macro";

export class Statistics extends Component {
  static propTypes = {
    statistics: PropTypes.array.isRequired,
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
          { this.props.statistics.map(statistic => (
            <div key={ statistic.title }>{ statistic.title }: { statistic.value }</div>
          )) }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  statistics: state.author.statistics
});

export default connect(mapStateToProps, { getStatistics })(Statistics);
