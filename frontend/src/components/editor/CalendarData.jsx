import React, { Component, Fragment } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Statistics from '../common/Statistics';
import Categories from './Categories';
import { changeCalendarData } from '../../actions/editor';

export class ICalendarData extends Component {
  static propTypes = {
    changeCalendarData: PropTypes.func.isRequired,
  };

  state = {
    selectedTab: 'stats',
  };

  render() {
    const { changeCalendarData: changeCalendarDataCall } = this.props;
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
              <Statistics changeCalendarData={changeCalendarDataCall} />
            </Tab>
            <Tab eventKey="categories" title={<Trans>Categories</Trans>}>
              <Categories changeCalendarData={changeCalendarDataCall} />
            </Tab>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

const CalendarData = connect(null, { changeCalendarData })(ICalendarData);
export default CalendarData;
