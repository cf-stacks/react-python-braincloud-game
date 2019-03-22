import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

import "../../css/Header.css";

export class Header extends Component {

  state = {
    currentTime: new Date().toLocaleString(),
    intervalID: null,
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const intervalID = setInterval( () => {
      this.setState({
        currentTime : new Date().toLocaleString()
      })
    },1000);
    this.setState({intervalID})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalID);
  }

  render () {
    const { user } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <span className="nav-link">
            {user ? <span>{user.name} <small>({user.email})</small></span> : <span>Loading...</span>}
          </span>
        </li>
        <li className="nav-item">
          <span className="nav-link"> | </span>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={this.props.logout}>Log out</Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/login" className="nav-link">Log in</Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">Register</Link>
        </li>
      </ul>
    );
    return (
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">Sesam</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon">button</span>
            </button>
            <div className="collapse navbar-collapse flex-column">
              <span className="navbar-text ml-auto p-0">
                { this.state.currentTime }
              </span>
              <span className="navbar-text ml-auto p-0">
                { user ? authLinks : guestLinks }
              </span>
            </div>
          </div>
        </nav>
      </header>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
