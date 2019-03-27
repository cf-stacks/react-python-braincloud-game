import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { addQuizQuestion, formUpdate, getTodayCategories } from '../../actions/author';
import CommonFieldError from '../common/FieldError';

export class QuestionForm extends Component {
  static propTypes = {
    formUpdate: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired,
    addQuizQuestion: PropTypes.func.isRequired,
    getTodayCategories: PropTypes.func.isRequired,
    categories: PropTypes.any,
  };

  componentDidMount() {
    const { getTodayCategories: getTodayCategoriesCall } = this.props;
    getTodayCategoriesCall();
  }

  onChange = (e) => {
    const { formUpdate: formUpdateCall } = this.props;
    formUpdateCall(e.target.name, e.target.value);
  };

  onSelectChange = (value) => {
    const { formUpdate: formUpdateCall } = this.props;
    formUpdateCall('category', value);
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { formValues, addQuizQuestion: addQuizQuestionCall } = this.props;
    const {
      category, description, answerCorrect, answerIncorrect1, answerIncorrect2,
    } = formValues;
    const question = {
      category: category.id,
      description,
      answer_correct: answerCorrect,
      answer_incorrect_1: answerIncorrect1,
      answer_incorrect_2: answerIncorrect2,
    };
    addQuizQuestionCall(question);
  };

  render() {
    const {
      formValues: { category },
      formValues: { description },
      formValues: { answerCorrect },
      formValues: { answerIncorrect1 },
      formValues: { answerIncorrect2 },
      categories,
    } = this.props;

    return (
      <Fragment>
        <h1 className="text-center"><Trans>Add quiz question</Trans></h1>
        <hr />
        <form onSubmit={this.onSubmit} className="px-3" id="add-question-form">
          <div className="form-group">
            <label htmlFor="category-id"><Trans>Category</Trans></label>
            <Select
              cacheOptions
              name="category"
              options={categories}
              defaultOptions
              onChange={this.onSelectChange}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt.id}
              value={category}
              placeholder={<Trans>Select category...</Trans>}
              noOptionsMessage={() => <Trans>No categories to show</Trans>}
            />
            <CommonFieldError for="category" />
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
            <CommonFieldError for="description" />
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
              <CommonFieldError for="answer_correct" />
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
              <CommonFieldError for="answer_incorrect_1" />
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
              <CommonFieldError for="answer_incorrect_2" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary"><Trans>Add</Trans></button>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  formValues: state.author.formValues,
  categories: state.author.categories,
});

export default connect(mapStateToProps, { addQuizQuestion, formUpdate, getTodayCategories })(QuestionForm);
