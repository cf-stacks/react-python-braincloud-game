import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from './Spinner';

export const IPrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.isLoading) return <Spinner />;
      if (!auth.user) return <Redirect to="/login" />;
      return <Component {...props} />;
    }}
  />
);

const mapStateToProps = state => ({
  auth: state.auth,
});

const PrivateRoute = connect(mapStateToProps)(IPrivateRoute);
export default PrivateRoute;
