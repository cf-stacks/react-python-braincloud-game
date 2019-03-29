import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import Select from 'react-select';

import Calendar from '../common/Calendar';
import { changeCalendarData, changeAssignedCategories } from '../../actions/editor';
import { getCategories } from '../../actions/common';
import { safeGet } from '../../utils/object_utils';

export class ICategories extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    assignedCategories: PropTypes.object.isRequired,
    calendarData: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    changeAssignedCategories: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      changeCalendarData: changeCalendarDataCall,
      getCategories: getCategoriesCall,
      calendarData: { date, view },
    } = this.props;
    changeCalendarDataCall(date, view);
    getCategoriesCall();
  }

  onSelectChange = (obj, date, value) => {
    const { assignedCategories, changeAssignedCategories: changeAssignedCategoriesCall } = this.props;
    const lst = safeGet(assignedCategories, `${obj}.${date}`, []);
    let items = lst.filter(x => !value.map(v => v.id).includes(x));
    let isDeleted = false;
    if (items.length !== 0) isDeleted = true;
    else items = value.map(v => v.id).filter(x => !lst.includes(x));
    changeAssignedCategoriesCall(obj, date, value, isDeleted, items);
  };


  handleClickCell = (element) => {
    const elem = element;
    if (elem.firstChild && elem.firstChild.nodeName.toLowerCase() === 'div') {
      elem.firstChild.className = elem.firstChild.className.replace(/\bd-none\b/g, '');
    }
  };

  handleRenderCell = (obj, date, value) => {
    const { categories } = this.props;
    const customStyles = {
      control: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? 'rgba(255,255,255,0.7)' : 'transparent',
        ':hover': {
          backgroundColor: 'rgba(255,255,255,0.3)',
        },
      }),
      multiValue: base => ({
        ...base,
        backgroundColor: 'rgb(115, 158, 226, 0.5)',
        border: 'solid 2px blue',
        borderRadius: '25px',
      }),
      multiValueLabel: base => ({
        ...base,
        color: 'black',
        fontWeight: 'bold',
      }),
      multiValueRemove: base => ({
        ...base,
        borderRadius: '25px',
      }),
    };
    return (
      <div className={value.length === 0 ? 'd-none' : ''}>
        <Select
          styles={customStyles}
          menuPortalTarget={document.body}
          cacheOptions
          isMulti
          name="category"
          options={categories}
          defaultOptions
          onChange={e => this.onSelectChange(obj, date, e)}
          getOptionLabel={opt => opt.name}
          getOptionValue={opt => opt.id}
          value={categories.filter(option => value.includes(option.id))}
          placeholder={<Trans>Select category...</Trans>}
        />
      </div>
    );
  };

  render() {
    const {
      user: { subordinates }, assignedCategories, calendarData, changeCalendarData: changeCalendarDataCall,
    } = this.props;
    return (
      <Fragment>
        <Calendar
          objects={subordinates}
          statistics={assignedCategories}
          calendarData={calendarData}
          changeCalendarData={changeCalendarDataCall}
          handleClickCell={this.handleClickCell}
          handleRenderCell={this.handleRenderCell}
          defaultRenderValue={[]}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  assignedCategories: state.editor.assignedCategories,
  calendarData: state.editor.calendarData,
  categories: state.common.categories,
});

const Categories = connect(mapStateToProps, {
  changeCalendarData, getCategories, changeAssignedCategories,
})(ICategories);
export default Categories;
