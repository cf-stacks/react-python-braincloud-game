import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import AuthorDashboard from "../author/Dashboard";
import EditorDashboard from "../editor/Dashboard";
import ChiefDashboard from "../chief/Dashboard";

export class Container extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  render() {
    let component;
    console.log(this.props.user);
    switch (this.props.user.groups[0].name) {
      case "Author":
        component = <AuthorDashboard />;
        break;
      case "Editor":
        component = <EditorDashboard />;
        break;
      case "Chief":
        component = <ChiefDashboard />;
        break;
      default:
        component = <div>???</div>
    }

    return (
      component
    )
  }
}

const mapStateTpProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateTpProps)(Container);