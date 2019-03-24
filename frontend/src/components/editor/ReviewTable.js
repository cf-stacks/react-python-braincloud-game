import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getQuestions, submitReview } from "../../actions/editor";
import { Tabs, Tab } from "react-bootstrap";
import { Trans } from "@lingui/macro";

export class ReviewTable extends Component {
  state = {
    selectedTab: ""
  };

  static propTypes = {
    questions: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getQuestions: PropTypes.func.isRequired,
    submitReview: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getQuestions();
  }

  onClick = event => {
    event.preventDefault();
    this.setState({selectedTab: event.target.getAttribute('data-user-id')})
  };

  render () {
    return (
      <Fragment>
        <h1 className="text-center"><Trans>Questions for review</Trans></h1>
        <hr/>
        <Tabs
          id="controlled-tab-example"
          activeKey={this.state.selectedTab}
          onSelect={key => this.setState({ selectedTab: key })}
          className="py-3"
        >
          <Tab eventKey="" title="All" />
        { this.props.user.subordinates.map(subordinate => (
          <Tab key={subordinate.id} eventKey={subordinate.id} title={subordinate.name} />
        ))}
        </Tabs>
        <ReviewTab
          questions={this.props.questions}
          user_id={this.state.selectedTab}
          submitReview={this.props.submitReview}
        />
      </Fragment>
    )
  }
}

export class ReviewTab extends Component {

  static propTypes = {
    questions: PropTypes.array.isRequired,
    user_id: PropTypes.string.isRequired,
    submitReview: PropTypes.func.isRequired,
  };

  onClick = event => {
    const button = event.target.closest("button");
    this.props.submitReview(button.getAttribute('data-id'), button.name);
  };

  render() {
    const user_questions = this.props.questions
      .filter(question => this.props.user_id === "" || question.author === this.props.user_id );
    return (
      <table className="table table-striped table-sm">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">#</th>
            <th className="text-center" style={{width: "20%"}}><Trans>Category</Trans></th>
            <th className="text-center"><Trans>Description</Trans></th>
            <th className="text-center"><Trans>Answers</Trans></th>
          </tr>
        </thead>
        <tbody>
        { user_questions.map((question, index) => (
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
                    <i className="fas fa-check"></i>
                  </button>
                  <button
                    className="btn btn-danger rounded-circle border border-secondary my-1"
                    type="submit"
                    name="reject"
                    data-id={question.id}
                    onClick={this.onClick}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </td>
            <td className="p-2 align-middle">
              <div className="text-justify">{ question.description }</div></td>
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
  )
  }
}

const mapStateToProps = state => ({
  questions: state.editor.questions,
  user: state.auth.user,
});

export default connect(mapStateToProps, { getQuestions, submitReview })(ReviewTable);
