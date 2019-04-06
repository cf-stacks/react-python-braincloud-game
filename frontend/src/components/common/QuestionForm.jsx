import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';

import { setDefaultCategory } from '../../actions/author';
import { addQuizQuestion, editQuizQuestion, getAvailableCategories } from '../../actions/common';
import { returnErrors } from '../../actions/messages';
import FieldError from './FieldError';
import CategorySelect from './CategorySelect';
import Spinner from './Spinner';
import NotFoundPage from '../layout/NotFoundPage';
import { i18n } from '../App';

export const Wrapper = (props) => {
  const { questionId } = props;
  return (
    <React.Fragment>
      <div className="jumbotron p-3">
        <h1 className="text-center">
          {questionId ? <Trans>Edit quiz question</Trans> : <Trans>Add quiz question</Trans>}
        </h1>
        <hr />
        <IQuestionForm {...props} />
      </div>
    </React.Fragment>
  );
};

const initialState = {
  form: {
    category: '',
    description: '',
    answerCorrect: '',
    answerIncorrect1: '',
    answerIncorrect2: '',
  },
  questionId: null,
  requestStatus: null,
};

export class IQuestionForm extends React.Component {
  static propTypes = {
    questionId: PropTypes.string,
    defaultCategory: PropTypes.string,
    addQuizQuestion: PropTypes.func.isRequired,
    editQuizQuestion: PropTypes.func.isRequired,
    categories: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      questionId: props.questionId,
    };
  }

  shouldComponentUpdate = (nextProps) => {
    const { defaultCategory } = this.props;
    return defaultCategory === nextProps.defaultCategory;
  };

  componentDidMount = () => {
    const {
      getAvailableCategories: getAvailableCategoriesCall,
      categories,
    } = this.props;
    this.getQuestionData();
    if (!categories) getAvailableCategoriesCall();
  };

  componentDidUpdate(prevProps, prevState) {
    const { questionId } = this.state;
    if (prevState.questionId !== questionId) {
      this.getQuestionData();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.questionId !== prevState.questionId) {
      return { questionId: nextProps.questionId };
    }
    if (nextProps.categories) {
      let selectedOption = null;
      if (!prevState.form.category && nextProps.defaultCategory) {
        selectedOption = nextProps.categories.find(obj => (obj.id === nextProps.defaultCategory));
        if (!selectedOption) nextProps.setDefaultCategory(selectedOption);
      }
      return { form: { ...prevState.form, category: selectedOption || prevState.form.category } };
    }
    return null;
  }

  getQuestionData = () => {
    const { returnErrors: returnErrorsCall, questionId } = this.props;
    if (questionId) {
      axios.get(
        `/api/internal/quiz/question/${questionId}/`,
      ).then(
        (res) => {
          this.setState({
            form: {
              category: res.data.category,
              description: res.data.description,
              answerCorrect: res.data.answer_correct,
              answerIncorrect1: res.data.answer_incorrect_1,
              answerIncorrect2: res.data.answer_incorrect_2,
            },
            requestStatus: res.status,
            questionId: res.data.id,
          });
        },
      ).catch(
        (err) => {
          this.setState({ requestStatus: err.response.status });
          returnErrorsCall(err.response.data, err.response.status);
        },
      );
    }
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
        history.push('/dashboard/');
      });
    } else {
      addQuizQuestionCall(data, () => this.setState(prevState => ({ ...prevState, form: initialState.form })));
    }
  };

  onCancel = (e) => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const {
      categories, questionId,
    } = this.props;
    if (!categories) return <Spinner message={i18n._(t`Loading categories...`)} />;
    const { form, requestStatus } = this.state;
    if (questionId && requestStatus === 404) return <NotFoundPage />;
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
    );
  }
}

const mapStateToProps = (state, parentProps) => ({
  questionId: parentProps.match ? parentProps.match.params.questionId : null,
  categories: state.common.availableCategories,
  defaultCategory: state.author.defaultCategory,
});

const QuestionForm = connect(mapStateToProps, {
  addQuizQuestion, editQuizQuestion, returnErrors, getAvailableCategories, setDefaultCategory,
})(Wrapper);
export default QuestionForm;
