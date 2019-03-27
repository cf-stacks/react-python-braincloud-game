import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { logout } from '../../actions/auth';

import '../../css/Header.css';

export class Header extends Component {
  state = {
    currentTime: new Date().toLocaleString(),
    intervalID: null,
  };

  static propTypes = {
    auth: PropTypes.shape({
      authToken: PropTypes.string,
      isLoading: PropTypes.bool.isRequired,
      refreshToken: PropTypes.string,
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
    }).isRequired,
    logout: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const intervalID = setInterval(() => {
      this.setState({
        currentTime: new Date().toLocaleString(),
      });
    }, 1000);
    this.setState({ intervalID });
  }

  componentWillUnmount() {
    const { intervalID } = this.state;
    clearInterval(intervalID);
  }

  render() {
    const { auth: { user }, logout: logoutCall } = this.props;
    const { currentTime } = this.state;

    const authLinks = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <span className="nav-link">
            {user ? (
              <span>
                {user.name}
                {' '}
                <small>
(
                  {user.email}
)
                </small>
              </span>
            ) : <span><Trans>Loading...</Trans></span>}
          </span>
        </li>
        <li className="nav-item">
          <span className="nav-link"> | </span>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={logoutCall}><Trans>Log out</Trans></Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/login" className="nav-link"><Trans>Log in</Trans></Link>
        </li>
      </ul>
    );
    return (
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/"><Trans>Sesam LOGO</Trans></Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">button</span>
            </button>
            <div className="collapse navbar-collapse flex-column">
              <span className="navbar-text ml-auto p-0">
                { currentTime }
              </span>
              <span className="navbar-text ml-auto p-0">
                { user ? authLinks : guestLinks }
              </span>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
