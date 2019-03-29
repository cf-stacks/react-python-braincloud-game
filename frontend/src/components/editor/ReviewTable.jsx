import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { Trans, t } from '@lingui/macro';
import { i18n } from '../App';

import { getQuestions, submitReview } from '../../actions/editor';
import EditorReviewTab from './ReviewTab';

class ReviewTable extends Component {
  state = {
    selectedTab: '',
  };

  static propTypes = {
    questions: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getQuestions: PropTypes.func.isRequired,
    submitReview: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    const { getQuestions: getQuestionsCall } = this.props;
    getQuestionsCall();
  }

  onClick = (event) => {
    event.preventDefault();
    this.setState({ selectedTab: event.target.getAttribute('data-user-id') });
  };

  render() {
    const { selectedTab } = this.state;
    const { questions, submitReview: submitReviewCall, user: { subordinates } } = this.props;
    return (
      <Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Questions for review</Trans></h1>
          <hr />
          <Tabs
            id="controlled-tab-example"
            activeKey={selectedTab}
            onSelect={key => this.setState({ selectedTab: key })}
            className="py-3"
          >
            <Tab eventKey="" title={i18n._(t`All`)} />
            { subordinates.map(subordinate => (
              <Tab key={subordinate.id} eventKey={subordinate.id} title={subordinate.name} />
            ))}
          </Tabs>
          <EditorReviewTab
            questions={questions}
            userId={selectedTab}
            submitReview={submitReviewCall}
          />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.editor.questions,
  user: state.auth.user,
});

export default connect(mapStateToProps, { getQuestions, submitReview })(ReviewTable);
