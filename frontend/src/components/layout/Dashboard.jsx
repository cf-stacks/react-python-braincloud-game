import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthorDashboard from '../author/Dashboard';
import EditorDashboard from '../editor/Dashboard';
import ChiefDashboard from '../chief/Dashboard';

export class IDashboard extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      date_joined: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ),
      id: PropTypes.string.isRequired,
      is_active: PropTypes.bool.isRequired,
      is_staff: PropTypes.bool.isRequired,
      is_superuser: PropTypes.bool.isRequired,
      last_login: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subordinates: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ),
    }),
  };

  render() {
    let component;
    const { user: { groups } } = this.props;
    switch (groups[0].name.toLowerCase()) {
      case 'author':
        component = <AuthorDashboard {...this.props} />;
        break;
      case 'editor':
        component = <EditorDashboard {...this.props} />;
        break;
      case 'chief':
        component = <ChiefDashboard {...this.props} />;
        break;
      default:
        component = <h1>Unknown group is assigned to you</h1>;
    }

    return (
      component
    );
  }
}

IDashboard.defaultProps = {
  user: null,
};

const mapStateTpProps = state => ({
  user: state.auth.user,
});

const Dashboard = connect(mapStateTpProps)(IDashboard);
export default Dashboard;
