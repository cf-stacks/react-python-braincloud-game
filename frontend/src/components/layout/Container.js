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
    if (this.props.user.groups.lenght === 0) return <h1>You do not have any group assigned. Contact chief to have one.</h1>
    switch (this.props.user.groups[0].name.toLowerCase()) {
      case "author":
        component = <AuthorDashboard />;
        break;
      case "editor":
        component = <EditorDashboard />;
        break;
      case "chief":
        component = <ChiefDashboard />;
        break;
      default:
        component = <h1>Unknown group is assigned to you</h1>
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