import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getQuestions } from "../../actions/editor";
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
        <ReviewTab questions={this.props.questions} user_id={this.state.selectedTab} />
      </Fragment>
    )
  }
}

export class ReviewTab extends Component {

  static propTypes = {
    questions: PropTypes.array.isRequired,
    user_id: PropTypes.string.isRequired,
  };

  render() {
    const user_questions = this.props.questions
      .filter(question => this.props.user_id === "" || question.author === this.props.user_id );
    return (
      <table className="table table-striped table-sm">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Correct answer</th>
            <th scope="col">Incorrect answer 1</th>
            <th scope="col">Incorrect answer 2</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
        { user_questions.map((question, index) => (
          <tr key={question.id}>
            <th scope="row">{ index + 1}</th>
            <td>{ question.category.name }</td>
            <td>{ question.description }</td>
            <td>{ question.answer_correct }</td>
            <td>{ question.answer_incorrect_1 }</td>
            <td>{ question.answer_incorrect_2 }</td>
            <td>
              <button className="btn btn-success" type="submit" name="accept"><i className="fas fa-check"></i></button>
              <button className="btn btn-danger" type="submit" name="reject"><i className="fas fa-times"></i></button>
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

export default connect(mapStateToProps, { getQuestions })(ReviewTable);
