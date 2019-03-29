import React, { Component, Fragment } from 'react';
// import Select from 'react-select';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import axios from 'axios';
import { addQuizQuestion, editQuizQuestion, getTodayCategories } from '../../actions/author';
import { returnErrors } from '../../actions/messages';
import FieldError from '../common/FieldError';
import CategorySelect from '../common/CategorySelect';

const initialState = {
  category: '',
  description: '',
  answerCorrect: '',
  answerIncorrect1: '',
  answerIncorrect2: '',
};

export class IQuestionForm extends Component {
  state = initialState;

  static propTypes = {
    questionId: PropTypes.string,
    addQuizQuestion: PropTypes.func.isRequired,
    getTodayCategories: PropTypes.func.isRequired,
    categories: PropTypes.any,
  };

  componentDidMount() {
    const { questionId, returnErrors: returnErrorsCall } = this.props;
    if (questionId) {
      axios
        .get(`/api/internal/quiz/question/${questionId}/`)
        .then((res) => {
          this.setState({
            category: res.data.category,
            description: res.data.description,
            answerCorrect: res.data.answer_correct,
            answerIncorrect1: res.data.answer_incorrect_1,
            answerIncorrect2: res.data.answer_incorrect_2,
          });
        }).catch(err => returnErrorsCall(err.response.data, err.response.status));
    }
    const { getTodayCategories: getTodayCategoriesCall } = this.props;
    getTodayCategoriesCall();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSelectChange = (value) => {
    this.setState({ category: value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const {
      questionId, history, addQuizQuestion: addQuizQuestionCall, editQuizQuestion: editQuizQuestionCall,
    } = this.props;
    const {
      category, description, answerCorrect, answerIncorrect1, answerIncorrect2,
    } = this.state;
    const data = {
      category: category.id,
      description,
      answer_correct: answerCorrect,
      answer_incorrect_1: answerIncorrect1,
      answer_incorrect_2: answerIncorrect2,
    };
    if (questionId) {
      editQuizQuestionCall(questionId, data, () => {
        history.push('/');
      });
    } else {
      addQuizQuestionCall(data, () => this.setState(initialState));
    }
  };

  onCancel = (e) => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { categories, questionId } = this.props;
    const {
      category, description, answerCorrect, answerIncorrect1, answerIncorrect2,
    } = this.state;
    const submitButton = (
      <button type="submit" className="btn btn-outline-primary m-2">
        { questionId ? <Trans>Apply</Trans> : <Trans>Add</Trans> }
      </button>
    );
    let cancelButton = null;
    if (questionId) {
      cancelButton = (
        <button type="button" className="btn btn-outline-danger m-2" onClick={this.onCancel}>
          <Trans>Cancel</Trans>
        </button>
      );
    }

    return (
      <Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center">
            { questionId ? <Trans>Edit quiz question</Trans> : <Trans>Add quiz question</Trans> }
          </h1>
          <hr />
          <form onSubmit={this.onSubmit} className="px-3" id="add-question-form">
            <div className="form-group">
              <label htmlFor="category-id"><Trans>Category</Trans></label>
              <CategorySelect
                options={categories}
                onChange={this.onSelectChange}
                value={category}
              />
              <FieldError for="category" />
            </div>
            <div className="form-group">
              <label htmlFor="description-id"><Trans>Description</Trans></label>
              <textarea
                id="description-id"
                className="form-control"
                name="description"
                onChange={this.onChange}
                value={description}
              />
              <FieldError for="description" />
            </div>
            <div className="row">
              <div className="col-4 form-group">
                <label htmlFor="answer_correct-id"><Trans>Correct answer</Trans></label>
                <input
                  id="answer_correct-id"
                  className="form-control bg-success text-white border-dark"
                  type="text"
                  name="answerCorrect"
                  onChange={this.onChange}
                  value={answerCorrect}
                />
                <FieldError for="answer_correct" />
              </div>
              <div className="col-4 form-group">
                <label htmlFor="answer_incorrect_1-id"><Trans>Incorrect answer 1</Trans></label>
                <input
                  id="answer_incorrect_1-id"
                  className="form-control bg-danger text-white border border-dark"
                  type="text"
                  name="answerIncorrect1"
                  onChange={this.onChange}
                  value={answerIncorrect1}
                />
                <FieldError for="answer_incorrect_1" />
              </div>
              <div className="col-4 form-group">
                <label htmlFor="answer_incorrect_2-id"><Trans>Incorrect answer 2</Trans></label>
                <input
                  id="answer_incorrect_2-id"
                  className="form-control bg-danger text-white border-dark"
                  type="text"
                  name="answerIncorrect2"
                  onChange={this.onChange}
                  value={answerIncorrect2}
                />
                <FieldError for="answer_incorrect_2" />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center">
              { submitButton }
              { cancelButton }
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, parentProps) => ({
  questionId: parentProps.match ? parentProps.match.params.questionId : null,
  categories: state.author.categories,
});

const QuestionForm = connect(mapStateToProps,
  {
    addQuizQuestion, getTodayCategories, editQuizQuestion, returnErrors,
  })(IQuestionForm);
export default QuestionForm;
