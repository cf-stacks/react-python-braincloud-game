import { Component } from 'react';
import { withRouter } from 'react-router';

export class IScrollToTop extends Component {
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
