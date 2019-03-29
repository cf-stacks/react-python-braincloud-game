import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import moment from 'moment';

export class IActiveTab extends React.Component {
  static propTypes = {
    count: PropTypes.number,
    users: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
    };
  }

  onClickSeeMore = () => {
    this.setState({ count: null });
  };

  render() {
    const { questions, userId, users } = this.props;
    const { count } = this.state;
    let userQuestions = questions;
    if (userId) {
      userQuestions = userQuestions.filter(
        question => users.find(obj => obj.id === userId).subordinates.map(obj => obj.id).includes(question.author),
      );
    }
    let seeAll = null;
    if (count && userQuestions.length > count) {
      userQuestions = userQuestions.slice(0, count);
      seeAll = (
        <tr>
          <td colSpan="4" className="p-2">
            <div className="text-center">
              <button type="button" onClick={this.onClickSeeMore} className="btn btn-outline-secondary">
                <Trans>See all</Trans>
              </button>
            </div>
          </td>
        </tr>
      );
    }
    return (
      <table className="table table-striped table-sm">
        <thead className="thead-dark">
          <tr>
            <th className="text-center" style={{ width: '5%' }}>#</th>
            <th className="text-center" style={{ width: '25%' }}><Trans>Category</Trans></th>
            <th className="text-center" style={{ width: '50%' }}><Trans>Description</Trans></th>
            <th className="text-center" style={{ width: '20%' }}><Trans>Answers</Trans></th>
          </tr>
        </thead>
        <tbody>
          { userQuestions.map((question, index) => (
            <tr key={question.id}>
              <th className="p-2 align-middle">
                <div>{ index + 1}</div>
              </th>
              <td className="p-2 align-middle">
                <div className="d-flex flex-column">
                  <div className="bg-warning rounded text-center border border-secondary my-1 font-weight-bold">
                    { question.category.name }
                  </div>
                  <div className="d-flex flex-row justify-content-around">
                    <button
                      disabled
                      className="btn btn-success rounded-circle border border-secondary my-1"
                      type="submit"
                      name="accept"
                      data-id={question.id}
                    >
                      <i className="fas fa-check" />
                    </button>
                    <button
                      disabled
                      className="btn btn-danger rounded-circle border border-secondary my-1"
                      type="submit"
                      name="reject"
                      data-id={question.id}
                    >
                      <i className="fas fa-times" />
                    </button>
                    <div className="d-flex flex-column text-center justify-content-center font-italic">
                      <small>{ moment(question.created_at).format('Y-MM-DD') }</small>
                      <small>{ moment(question.created_at).format('HH:mm') }</small>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="btn btn-primary rounded-circle border border-secondary my-1"
                    >
                      <i className="fas fa-edit" />
                    </button>
                  </div>
                </div>
              </td>
              <td className="p-2 align-middle">
                <div className="text-justify">{ question.description }</div>
              </td>
              <td className="p-2 align-middle">
                <div className="d-flex flex-column">
                  <div className="bg-success rounded text-center my-1 border border-secondary font-weight-bold">
                    { question.answer_correct }
                  </div>
                  <div className="bg-danger rounded text-center my-1 border border-secondary font-weight-bold">
                    { question.answer_incorrect_1 }
                  </div>
                  <div className="bg-danger rounded text-center my-1 border border-secondary font-weight-bold">
                    { question.answer_incorrect_2 }
                  </div>
                </div>
              </td>
            </tr>
          )) }
          { seeAll }
        </tbody>
      </table>
    );
  }
}

const ActiveTab = IActiveTab;
export default ActiveTab;
