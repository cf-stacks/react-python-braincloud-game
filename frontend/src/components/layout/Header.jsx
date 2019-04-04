import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { Navbar, Nav } from 'react-bootstrap';

import { logout } from '../../actions/auth';
import logo from '../../images/logo.png';

import '../../css/Header.css';

export class IHeader extends React.Component {
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
    const { auth: { user }, logout: logoutCall, match } = this.props;
    const { currentTime } = this.state;

    let beginLink = (
      <Trans>Loading...</Trans>
    );
    if (user) {
      beginLink = (
        <span>
          {user.name}
          {' '}
          <small>
            (
            {user.email}
            )
          </small>
        </span>
      );
    }

    const authLinks = (
      <Nav>
        <Nav.Link>
          {beginLink}
        </Nav.Link>
        <span className="nav-link">|</span>
        <Nav.Link as={Link} to="/" onClick={logoutCall}>
          <Trans>Log out</Trans>
        </Nav.Link>
      </Nav>
    );

    const guestLinks = (
      <Nav>
        <Nav.Link as={Link} to="/login/"><Trans>Log in</Trans></Nav.Link>
      </Nav>
    );

    const navLinks = [];
    if (user) {
      navLinks.push(<Nav.Link as={Link} to="/" eventKey={1} key="home"><Trans>Home</Trans></Nav.Link>);
      if (user.groups) {
        navLinks.push(
          <Nav.Link as={Link} to="/dashboard/" eventKey={2} key="dashboard">
            <Trans>Dashboard</Trans>
          </Nav.Link>,
        );
      }
    }
    const ddd = match.url.startsWith('/dashboard/') ? 2 : 1;
    return (
      <header>
        <Navbar variant="dark" bg="dark" expand="md" fixed="top">
          <div className="container">
            <Navbar.Brand href="/">
              <img src={logo} alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" activeKey={ddd}>
                {navLinks}
              </Nav>
              <Nav className="flex-column">
                <Navbar.Text className="ml-auto p-0">
                  {currentTime}
                </Navbar.Text>
                <Navbar.Text className="ml-auto p-0">
                  { user ? authLinks : guestLinks }
                </Navbar.Text>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const Header = connect(mapStateToProps, { logout })(IHeader);
export default Header;
