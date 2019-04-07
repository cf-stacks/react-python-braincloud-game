import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

export class IToaster extends React.Component {
  static propTypes = {
    error: PropTypes.shape({
      status: PropTypes.number,
      msg: PropTypes.any,
    }).isRequired,
    message: PropTypes.shape({
      success: PropTypes.string,
      warning: PropTypes.string,
      default: PropTypes.string,
      error: PropTypes.string,
      info: PropTypes.string,
    }).isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, message } = this.props;
    if (error !== prevProps.error) {
      if (error.status === 401) return;
      if (error.status === 404 && !error.msg.detail) toast.error('Page not found');
      else if (error.msg.detail) toast.error(error.msg.detail);
      else if (error.msg.non_field_errors) toast.error(error.msg.non_field_errors.join());
    }
    if (message && message !== prevProps.message) {
      if (message.success) toast.success(message.success);
    }
  }

  render() {
    return <React.Fragment />;
  }
}

const mapStateToProps = state => ({
  error: state.errors,
  message: state.messages,
});


const Toaster = connect(mapStateToProps)(IToaster);
export default Toaster;
