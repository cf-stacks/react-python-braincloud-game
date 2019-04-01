import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { t, Trans } from '@lingui/macro';

import { getStoppedQuestions, deleteQuestion, resumeQuestion } from '../../actions/chief';
import StoppedTab from './StoppedTab';
import { i18n } from '../App';

export class IStoppedTable extends React.Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getStoppedQuestions: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    resumeQuestion: PropTypes.func.isRequired,
  };

  state = {
    selectedTab: '',
  };

  componentDidMount() {
    const { getStoppedQuestions: getStoppedQuestionsCall } = this.props;
    getStoppedQuestionsCall();
  }

  onClick = (event) => {
    event.preventDefault();
    this.setState({ selectedTab: event.target.getAttribute('data-user-id') });
  };

  render() {
    const { selectedTab } = this.state;
    const {
      questions,
      user: { subordinates },
      deleteQuestion: deleteQuestionCall,
      resumeQuestion: resumeQuestionCall,
    } = this.props;
    return (
      <React.Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Stopped questions</Trans></h1>
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
          <StoppedTab
            count={5}
            users={subordinates}
            questions={questions}
            userId={selectedTab}
            deleteQuestion={deleteQuestionCall}
            resumeQuestion={resumeQuestionCall}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.chief.stoppedQuestions,
  user: state.auth.user,
});

const StoppedTable = connect(mapStateToProps, {
  getStoppedQuestions,
  deleteQuestion,
  resumeQuestion,
})(IStoppedTable);
export default StoppedTable;
