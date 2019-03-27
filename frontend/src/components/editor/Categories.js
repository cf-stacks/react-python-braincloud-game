import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Trans } from "@lingui/macro";

import { Calendar } from "./Calendar";
import { changeCalendarData, changeAssignedCategories } from "../../actions/editor";
import {createMessage} from "../../actions/messages";
import Select from "react-select";
import {getCategories} from "../../actions/common";

import ReactDOM from "react-dom";
import {safeGet} from "../../utils/object_utils";

export class Categories extends Component {

  state = {
    selects: {}
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    assignedCategories: PropTypes.object.isRequired,
    calendarData: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    changeAssignedCategories: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.changeCalendarData(this.props.calendarData.date, this.props.calendarData.view);
    this.props.getCategories();
  }

  onSelectChange = (obj, date, value) => {
    const lst = safeGet(this.props.assignedCategories, `${obj}.${date}`, []);
    let items = lst.filter(x => !value.map(v => v.id).includes(x));
    let isDeleted = false;
    if (items.length !== 0) isDeleted = true;
    else items = value.map(v => v.id).filter(x => !lst.includes(x));
    this.props.changeAssignedCategories(obj, date, value, isDeleted, items)
  };


  handleClickCell = (element, obj, date) => {
    if (element.firstChild && element.firstChild.nodeName.toLowerCase() === 'div')
      element.firstChild.className = element.firstChild.className.replace(/\bd-none\b/g, "")
  };

  handleRenderCell = (obj, date, value) => {
    const customStyles = {
      control: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "rgba(255,255,255,0.7)" : "transparent",
        ":hover": {
          backgroundColor: "rgba(255,255,255,0.3)"
        }
      }),
      multiValue: (base, state) => ({
        ...base,
        backgroundColor: "rgb(115, 158, 226, 0.5)",
        border: "solid 2px blue",
        borderRadius: "25px",
      }),
      multiValueLabel: (base, state) => ({
        ...base,
        color: "black",
        fontWeight: "bold",
      }),
      multiValueRemove: (base, state) => ({
        ...base,
        borderRadius: "25px",
      })
    };
    return (
      <div className={value.length === 0 ? "d-none": ""}>
        <Select
          styles={customStyles}
          menuPortalTarget={document.body}
          cacheOptions
          isMulti
          name="category"
          options={ this.props.categories }
          defaultOptions
          onChange={ e => this.onSelectChange(obj, date, e) }
          getOptionLabel={ opt => opt.name }
          getOptionValue={ opt => opt.id }
          value={this.props.categories.filter(option => value.includes(option.id))}
          placeholder={<Trans>Select category...</Trans>}
        />
      </div>
    )
  };

  render() {
    return (
      <Fragment>
        <Calendar
          objects={this.props.user.subordinates}
          statistics={this.props.assignedCategories}
          calendarData={this.props.calendarData}
          changeCalendarData={this.props.changeCalendarData}
          handleClickCell={this.handleClickCell}
          handleRenderCell={this.handleRenderCell}
          defaultRenderValue={[]}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  assignedCategories: state.editor.assignedCategories,
  calendarData: state.editor.calendarData,
  categories: state.common.categories,
});

export default connect(mapStateToProps, {changeCalendarData, createMessage, getCategories, changeAssignedCategories})(Categories);