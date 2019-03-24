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
        <table className="table table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center"><Trans>Description</Trans></th>
              <th className="text-center" style={{width: "20%"}}><Trans>Category</Trans></th>
              <th className="text-center" style={{width: "20%"}}><Trans>Correct answer</Trans></th>
            </tr>
          </thead>
          <tbody>
          { this.props.todayList.map((question, index) => (
            <tr key={ question.id }>
              <th className="p-2 align-middle">{ index + 1 }</th>
              <td className="p-2 align-middle">
                <div className="text-justify">{ question.description }</div>
              </td>
              <td className="p-2 align-middle">
                <div className="bg-warning rounded text-center border border-secondary my-1 font-weight-bold">
                  { question.category.name }
                </div>
              </td>
              <td className="p-2 align-middle">
                <div className="bg-success rounded text-center my-1 border border-secondary font-weight-bold">
                  { question.answer_correct }
                </div>
              </td>
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
