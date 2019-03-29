import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import { login } from '../../actions/auth';
import FieldError from '../common/FieldError';

export class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  onSubmit = (event) => {
    const { email, password } = this.state;
    const { login: loginCall } = this.props;
    event.preventDefault();
    loginCall(email, password);
  };

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  render() {
    const { user } = this.props;
    const { email, password } = this.state;
    if (user) return <Redirect to="/" />;
    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center"><Trans>Login</Trans></h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label><Trans>Email</Trans></label>
              <input
                type="text"
                className="form-control"
                name="email"
                onChange={this.onChange}
                value={email}
              />
              <FieldError for="email" />
            </div>
            <div className="form-group">
              <label><Trans>Password</Trans></label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={this.onChange}
                value={password}
              />
              <FieldError for="password" />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary"><Trans>Log in</Trans></button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { login })(Login);
