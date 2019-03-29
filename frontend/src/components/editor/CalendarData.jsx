import React, { Component, Fragment } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import Statistics from '../common/Statistics';
import Categories from './Categories';

export class CalendarData extends Component {
  state = {
    selectedTab: 'stats',
  };

  render() {
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
            <Tab eventKey="stats" title={<Trans>Authors</Trans>}>
              <Statistics />
            </Tab>
            <Tab eventKey="categories" title={<Trans>Categories</Trans>}>
              <Categories />
            </Tab>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

export default CalendarData;
