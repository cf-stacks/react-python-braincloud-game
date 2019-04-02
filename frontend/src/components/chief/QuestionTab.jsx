import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  deleteQuestion,
  resumeQuestion,
  stopQuestion,
  acceptQuestion,
  rejectQuestion,
} from '../../actions/chief';

export class IQuestionTab extends React.Component {
  static propTypes = {
    count: PropTypes.number,
    questions: PropTypes.array.isRequired,
    allowActions: PropTypes.object,
    getQuerySet: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    resumeQuestion: PropTypes.func.isRequired,
    stopQuestion: PropTypes.func.isRequired,
    acceptQuestion: PropTypes.func.isRequired,
    rejectQuestion: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
    };
  }

  componentDidMount() {
    const { getQuerySet: getQuerySetCall, questions } = this.props;
    if (!questions.length) getQuerySetCall();
  }

  onClickSeeMore = () => {
    this.setState({ count: null });
  };

  render() {
    const {
      questions,
      allowActions,
      deleteQuestion: deleteQuestionCall,
      resumeQuestion: resumeQuestionCall,
      stopQuestion: stopQuestionCall,
      acceptQuestion: acceptQuestionCall,
      rejectQuestion: rejectQuestionCall,
    } = this.props;
    const { count } = this.state;
    let userQuestions = questions;
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
                  <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-column text-center justify-content-center font-italic">
                      <small>{ moment(question.created_at).format('Y-MM-DD') }</small>
                      <small>{ moment(question.created_at).format('HH:mm') }</small>
                    </div>
                    <div className="d-flex justify-content-end">
                      { allowActions.accept ? (
                        <button
                          type="button"
                          className="btn btn-success rounded-circle border border-secondary my-1"
                          onClick={() => acceptQuestionCall(question)}
                        >
                          <i className="fas fa-check" />
                        </button>
                      ) : (
                        null
                      )}
                      { allowActions.reject ? (
                        <button
                          type="button"
                          className="btn btn-danger rounded-circle border border-secondary my-1"
                          onClick={() => rejectQuestionCall(question)}
                        >
                          <i className="fas fa-times" />
                        </button>
                      ) : (
                        null
                      )}
                      { allowActions.stop ? (
                        <button
                          type="button"
                          className="btn btn-danger rounded-circle border border-secondary my-1"
                          onClick={() => stopQuestionCall(question)}
                        >
                          <i className="fas fa-stop" />
                        </button>
                      ) : (
                        null
                      )}
                      { allowActions.resume ? (
                        <button
                          type="button"
                          className="btn btn-success rounded-circle border border-secondary my-1"
                          onClick={() => resumeQuestionCall(question)}
                        >
                          <i className="fas fa-play" />
                        </button>
                      ) : (
                        null
                      )}
                      { allowActions.edit ? (
                        <Link
                          className="btn btn-primary rounded-circle border border-secondary my-1"
                          to={`/quiz/question/${question.id}`}
                        >
                          <i className="fas fa-edit" />
                        </Link>
                      ) : (
                        null
                      )}
                      { allowActions.delete ? (
                        <button
                          type="button"
                          className="btn btn-danger rounded-circle border border-secondary my-1"
                          onClick={() => deleteQuestionCall(question)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      ) : (
                        null
                      )}
                    </div>
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

const mapStateToProps = (state, parentProps) => ({
  allowActions: parentProps.allowActions || {},
});

const QuestionTab = IQuestionTab;
export default connect(mapStateToProps, {
  deleteQuestion,
  resumeQuestion,
  stopQuestion,
  acceptQuestion,
  rejectQuestion,
})(QuestionTab);
