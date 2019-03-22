import React, {Component, Fragment} from "react";
import Select from "react-select";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addQuizQuestion, formUpdate, getCategories } from "../../actions/author";
import FieldError from "../common/FieldError";
import {Trans} from "@lingui/macro";

export class QuestionForm extends Component {

  static propTypes = {
    addQuizQuestion: PropTypes.func.isRequired,
    formUpdate: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    form_values: PropTypes.object.isRequired,
  };

  onChange = e => this.props.formUpdate(e.target.name, e.target.value);
  onSelectChange = value => this.props.formUpdate("category", value);

  onSubmit = e => {
    e.preventDefault();
    const {category, description, answer_correct, answer_incorrect_1, answer_incorrect_2} = this.props.form_values;
    const question = {category: category.id, description, answer_correct, answer_incorrect_1, answer_incorrect_2};
    this.props.addQuizQuestion(question);
  };

  componentDidMount() {
    this.props.getCategories();
  }

  render () {
    const { category, description, answer_correct, answer_incorrect_1, answer_incorrect_2} = this.props.form_values;
    return (
      <Fragment>
        <h1 className="text-center"><Trans>Add quiz question</Trans></h1>
        <hr/>
        <form onSubmit={this.onSubmit} className="px-3">
        <div className="form-group">
          <label><Trans>Category</Trans></label>
          <Select
            cacheOptions
            name="category"
            options={ this.props.categories }
            defaultOptions
            onChange={ this.onSelectChange }
            getOptionLabel={ opt => opt.name }
            getOptionValue={ opt => opt.id }
            value={ category }
            placeholder={<Trans>Select category...</Trans>}
          />
          <FieldError for="category" />
        </div>
        <div className="form-group">
          <label><Trans>Description</Trans></label>
          <input
            className="form-control"
            type="textarea"
            name="description"
            onChange={ this.onChange }
            value={ description }
          />
          <FieldError for="description" />
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label><Trans>Correct answer</Trans></label>
            <input
              className="form-control"
              type="text"
              name="answer_correct"
              onChange={ this.onChange }
              value={ answer_correct }
            />
            <FieldError for="answer_correct" />
          </div>
          <div className="col-4 form-group has-warning">
            <label><Trans>Incorrect answer 1</Trans></label>
            <input
              className="form-control form-control-warning"
              type="text"
              name="answer_incorrect_1"
              onChange={ this.onChange }
              value={ answer_incorrect_1 }
            />
            <FieldError for="answer_incorrect_1" />
          </div>
          <div className="col-4 form-group">
            <label><Trans>Incorrect answer 2</Trans></label>
            <input
              className="form-control"
              type="text"
              name="answer_incorrect_2"
              onChange={ this.onChange }
              value={ answer_incorrect_2 }
            />
            <FieldError for="answer_incorrect_2" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary"><Trans>Add</Trans></button>
      </form>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  error: state.errors.msg,
  form_values: state.author.form_values,
  categories: state.author.categories,
});

export default connect(mapStateToProps, { addQuizQuestion, formUpdate, getCategories })(QuestionForm);