import React, { Component, Fragment } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import EditorStatistics from './Statistics';
import EditorCategories from './Categories';

export class CalendarData extends Component {
  state = {
    selectedTab: 'stats',
  };

  render() {
    const { selectedTab } = this.state;
    return (
      <Fragment>
        <h1 className="text-center"><Trans>Calendar data</Trans></h1>
        <hr />
        <Tabs
          id="controlled-tab-example"
          activeKey={selectedTab}
          onSelect={key => this.setState({ selectedTab: key })}
          className="py-3"
        >
          <Tab eventKey="stats" title={<Trans>Authors</Trans>}>
            <EditorStatistics />
          </Tab>
          <Tab eventKey="categories" title={<Trans>Categories</Trans>}>
            <EditorCategories />
          </Tab>
        </Tabs>
      </Fragment>
    );
  }
}

export default CalendarData;
