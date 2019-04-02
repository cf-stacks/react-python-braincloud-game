import React, { Component, Fragment } from 'react';
// import Select from 'react-select';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import axios from 'axios';
import { addQuizQuestion, editQuizQuestion, getAvailableCategories } from '../../actions/common';
import { returnErrors } from '../../actions/messages';
import FieldError from './FieldError';
import CategorySelect from './CategorySelect';
import Spinner from './Spinner';

const initialState = {
  form: {
    category: '',
    description: '',
    answerCorrect: '',
    answerIncorrect1: '',
    answerIncorrect2: '',
  },
};

export class IQuestionForm extends Component {
  state = initialState;

  static propTypes = {
    questionId: PropTypes.string,
    addQuizQuestion: PropTypes.func.isRequired,
    editQuizQuestion: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  };

  componentDidMount = () => {
    const {
      questionId,
      returnErrors: returnErrorsCall,
      getAvailableCategories: getAvailableCategoriesCall,
      categories,
    } = this.props;
    if (questionId) {
      axios
        .get(`/api/internal/quiz/question/${questionId}/`)
        .then((res) => {
          this.setState({
            form: {
              category: res.data.category,
              description: res.data.description,
              answerCorrect: res.data.answer_correct,
              answerIncorrect1: res.data.answer_incorrect_1,
              answerIncorrect2: res.data.answer_incorrect_2,
            },
          });
        }).catch(err => returnErrorsCall(err.response.data, err.response.status));
    }
    if (!categories.length) getAvailableCategoriesCall();
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({ ...prevState, form: { ...prevState.form, [name]: value } }));
  };

  onSelectChange = (value) => {
    this.setState(prevState => ({ ...prevState, form: { ...prevState.form, category: value } }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const {
      questionId, history, addQuizQuestion: addQuizQuestionCall, editQuizQuestion: editQuizQuestionCall,
    } = this.props;
    const { form } = this.state;
    const data = {
      category: form.category.id,
      description: form.description,
      answer_correct: form.answerCorrect,
      answer_incorrect_1: form.answerIncorrect1,
      answer_incorrect_2: form.answerIncorrect2,
    };
    if (questionId) {
      editQuizQuestionCall(questionId, data, () => {
        history.push('/');
      });
    } else {
      addQuizQuestionCall(data, () => this.setState({ form: initialState.form }));
    }
  };

  onCancel = (e) => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { categories, questionId } = this.props;
    const { form } = this.state;
    if (questionId && form.category === '') return <Spinner />;
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
                value={form.category}
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
                value={form.description}
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
                  value={form.answerCorrect}
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
                  value={form.answerIncorrect1}
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
                  value={form.answerIncorrect2}
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
  categories: state.common.availableCategories,
});

const QuestionForm = connect(mapStateToProps, {
  addQuizQuestion, editQuizQuestion, returnErrors, getAvailableCategories,
})(IQuestionForm);
export default QuestionForm;
