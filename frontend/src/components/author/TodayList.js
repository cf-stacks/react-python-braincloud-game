import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTodayList } from "../../actions/author";
import {Trans} from "@lingui/macro";

export class TodayList extends Component {
  static propTypes = {
    todayList: PropTypes.array.isRequired,
    getTodayList: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    this.props.getTodayList();
  };

  render () {
    return (
      <Fragment>
        <h1 className="text-center"><Trans>Today added</Trans></h1>
        <hr/>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th><Trans>Description</Trans></th>
              <th><Trans>Category</Trans></th>
              <th><Trans>Correct answer</Trans></th>
            </tr>
          </thead>
          <tbody>
          { this.props.todayList.map((question, index) => (
            <tr key={ question.id }>
              <th>{ index + 1 }</th>
              <td>{ question.description }</td>
              <td>{ question.category.name }</td>
              <td>{ question.answer_correct }</td>
            </tr>
          ))}
          </tbody>
        </table>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  todayList: state.author.todayList,
});

export default connect(mapStateToProps, { getTodayList })(TodayList);
