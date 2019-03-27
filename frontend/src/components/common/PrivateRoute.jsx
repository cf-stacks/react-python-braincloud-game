import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import CommonSpinner from './Spinner';

export const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.isLoading) return <CommonSpinner />;
      if (!auth.user) return <Redirect to="/login" />;
      return <Component {...props} />;
    }}
  />
);

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
