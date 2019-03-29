import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthorDashboard from '../author/Dashboard';
import EditorDashboard from '../editor/Dashboard';
import ChiefDashboard from '../chief/Dashboard';

export class IContainer extends Component {
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
    if (groups.lenght === 0) {
      return <h1>You do not have any group assigned. Contact chief to have one.</h1>;
    }
    switch (groups[0].name.toLowerCase()) {
      case 'author':
        component = <AuthorDashboard />;
        break;
      case 'editor':
        component = <EditorDashboard />;
        break;
      case 'chief':
        component = <ChiefDashboard />;
        break;
      default:
        component = <h1>Unknown group is assigned to you</h1>;
    }

    return (
      component
    );
  }
}

IContainer.defaultProps = {
  user: null,
};

const mapStateTpProps = state => ({
  user: state.auth.user,
});

const Container = connect(mapStateTpProps)(IContainer);
export default Container;
