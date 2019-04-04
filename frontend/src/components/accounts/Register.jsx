import React from 'react';
import { Link } from 'react-router-dom';

export class Register extends React.Component {
  state = {
    email: '',
    password: '',
    password2: '',
  };

  onSubmit = event => event.preventDefault();

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  render() {
    const { email, password, password2 } = this.state;
    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Register</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                onChange={this.onChange}
                value={email}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={this.onChange}
                value={password}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="password2"
                onChange={this.onChange}
                value={password2}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Register</button>
            </div>
            <p>
              Already have an account?
              <Link to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
