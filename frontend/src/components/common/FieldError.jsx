import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../../css/FieldError.css';

export const IFieldError = (props) => {
  const { error, for: name } = props;
  const errorMessage = error[name] ? error[name] : '';
  return (
    <p className="px-1 font-italic text-danger">{errorMessage}</p>
  );
};

IFieldError.propTypes = {
  for: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  error: state.errors.msg,
});

const FieldError = connect(mapStateToProps)(IFieldError);
export default FieldError;
