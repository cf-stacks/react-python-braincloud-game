import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { t, Trans } from '@lingui/macro';

import { getPendingQuestions } from '../../actions/chief';
import PendingTab from './PendingTab';
import { i18n } from '../App';

export class IPendingTable extends React.Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getPendingQuestions: PropTypes.func.isRequired,
  };

  state = {
    selectedTab: '',
  };

  componentDidMount() {
    const { getPendingQuestions: getPendingQuestionsCall } = this.props;
    getPendingQuestionsCall();
  }

  onClick = (event) => {
    event.preventDefault();
    this.setState({ selectedTab: event.target.getAttribute('data-user-id') });
  };

  render() {
    const { selectedTab } = this.state;
    const { questions, user: { subordinates } } = this.props;
    return (
      <React.Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Pending questions</Trans></h1>
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
          <PendingTab
            count={5}
            users={subordinates}
            questions={questions}
            userId={selectedTab}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.chief.pendingQuestions,
  user: state.auth.user,
});

const PendingTable = connect(mapStateToProps, { getPendingQuestions })(IPendingTable);
export default PendingTable;
