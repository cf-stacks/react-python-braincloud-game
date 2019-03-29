import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Statistics from '../common/Statistics';
import { changeCalendarData } from '../../actions/chief';

export class ICalendarData extends React.Component {
  static propTypes = {
    changeCalendarData: PropTypes.func.isRequired,
  };

  state = {
    selectedTab: 'editors',
  };

  render() {
    const { user, changeCalendarData: changeCalendarDataCall } = this.props;
    const { selectedTab } = this.state;
    return (
      <React.Fragment>
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
              <Statistics changeCalendarData={changeCalendarDataCall} />
            </Tab>
            { user.subordinates.map(subordinate => (
              <Tab key={subordinate.id} eventKey={subordinate.id} title={subordinate.name}>
                <Statistics user={subordinate} changeCalendarData={changeCalendarDataCall} />
              </Tab>
            ))}
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

const CalendarData = connect(mapStateToProps, { changeCalendarData })(ICalendarData);
export default CalendarData;
