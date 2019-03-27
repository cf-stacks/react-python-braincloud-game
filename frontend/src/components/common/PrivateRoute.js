import React from 'react';
import { Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from './Spinner';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      console.log('here', auth);
      if (auth.isLoading) return <Spinner />;
      if (!auth.user) return <Redirect to="/login" />;
      return <Component {...props} />;
    }}
  />
);

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
