import React from 'react';
import { withRouter } from 'react-router';

export class IScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

const ScrollToTop = withRouter(IScrollToTop);
export default ScrollToTop;
