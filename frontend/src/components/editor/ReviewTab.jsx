import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';

export class ReviewTab extends React.Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    submitReview: PropTypes.func.isRequired,
  };

  onClick = (event) => {
    const button = event.target.closest('button');
    const { submitReview: submitReviewCall } = this.props;
    submitReviewCall(button.getAttribute('data-id'), button.name);
  };

  render() {
    const { questions, userId } = this.props;
    let userQuestions = questions;
    if (userId) {
      userQuestions = questions.filter(question => question.author === userId);
    }
    return (
      <table className="table table-striped table-sm">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">#</th>
            <th className="text-center" style={{ width: '25%' }}><Trans>Category</Trans></th>
            <th className="text-center"><Trans>Description</Trans></th>
            <th className="text-center"><Trans>Answers</Trans></th>
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
                      className="btn btn-success rounded-circle border border-secondary my-1"
                      type="submit"
                      name="accept"
                      data-id={question.id}
                      onClick={this.onClick}
                    >
                      <i className="fas fa-thumbs-up" />
                    </button>
                    <button
                      className="btn btn-danger rounded-circle border border-secondary my-1"
                      type="submit"
                      name="reject"
                      data-id={question.id}
                      onClick={this.onClick}
                    >
                      <i className="fas fa-thumbs-down" />
                    </button>
                    <div className="d-flex flex-column text-center justify-content-center font-italic">
                      <small>{ moment(question.created_at).format('Y-MM-DD') }</small>
                      <small>{ moment(question.created_at).format('HH:mm') }</small>
                    </div>
                    <Link
                      className="btn btn-primary rounded-circle border border-secondary my-1"
                      to={`quiz/question/${question.id}/`}
                    >
                      <i className="fas fa-pencil-alt" />
                    </Link>
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
        </tbody>
      </table>
    );
  }
}

export default ReviewTab;
