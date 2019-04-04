import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from './Spinner';
import ForbiddenPage from '../layout/ForbiddenPage';

export const IStaffRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.isLoading) return <Spinner />;
      if (!auth.user) return <Redirect to="/login" />;
      if (!auth.user.is_staff || !auth.user.groups.length) return <ForbiddenPage />;
      return <Component {...props} />;
    }}
  />
);

const mapStateToProps = state => ({
  auth: state.auth,
});

const StaffRoute = connect(mapStateToProps)(IStaffRoute);
export default StaffRoute;
