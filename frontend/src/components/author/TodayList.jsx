import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { getTodayList } from '../../actions/author';

export class ITodayList extends Component {
  static propTypes = {
    todayList: PropTypes.array.isRequired,
    getTodayList: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    const { getTodayList: getTodayListCall } = this.props;
    getTodayListCall();
  };

  render() {
    const { todayList } = this.props;
    return (
      <Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Today added</Trans></h1>
          <hr />
          <table className="table table-striped table-sm">
            <thead className="thead-dark">
              <tr>
                <th className="text-center">#</th>
                <th className="text-center"><Trans>Description</Trans></th>
                <th className="text-center" style={{ width: '20%' }}><Trans>Category</Trans></th>
                <th className="text-center" style={{ width: '20%' }}><Trans>Correct answer</Trans></th>
              </tr>
            </thead>
            <tbody>
              { todayList.map((question, index) => (
                <tr key={question.id}>
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
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  todayList: state.author.todayList,
});

const TodayList = connect(mapStateToProps, { getTodayList })(ITodayList);
export default TodayList;
