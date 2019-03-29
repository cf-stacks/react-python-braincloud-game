import React, { Component, Fragment } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { connect } from 'react-redux';
import Statistics from '../common/Statistics';

export class ICalendarData extends Component {
  state = {
    selectedTab: 'editors',
  };

  render() {
    const { user } = this.props;
    const { selectedTab } = this.state;
    return (
      <Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Calendar data</Trans></h1>
          <hr />
          <Tabs
            id="controlled-tab-example"
            activeKey={selectedTab}
            onSelect={key => this.setState({ selectedTab: key })}
            className="py-3"
          >
            <Tab eventKey="editors" title={<Trans>Editors</Trans>}>
              <Statistics />
            </Tab>
            { user.subordinates.map(subordinate => (
              <Tab key={subordinate.id} eventKey={subordinate.id} title={subordinate.name}>
                <Statistics user={subordinate} />
              </Tab>
            ))}
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

const CalendarData = connect(mapStateToProps)(ICalendarData);
export default CalendarData;
