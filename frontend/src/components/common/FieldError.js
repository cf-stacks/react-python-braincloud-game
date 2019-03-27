import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../../css/FieldError.css';

export class FieldError extends Component {

  static propTypes = {
    for: PropTypes.string.isRequired,
    error: PropTypes.object.isRequired,
  };

  render() {
    const { error, for: name } = this.props;
    const errorMessage = error[name] ? error[name] : "";
    return (
      <p className="px-1 font-italic text-danger">{errorMessage}</p>
    )
  };
}

const mapStateToProps = state => ({
    error: state.errors.msg,
});

export default connect(mapStateToProps)(FieldError);
