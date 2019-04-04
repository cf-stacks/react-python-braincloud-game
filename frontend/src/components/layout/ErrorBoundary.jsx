import React from 'react';

import ServerErrorPage from './ServerErrorPage';

export class IErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch = () => {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  };

  render = () => {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <ServerErrorPage parent={this} />;
    }
    return children;
  }
}

const ErrorBoundary = IErrorBoundary;
export default ErrorBoundary;
