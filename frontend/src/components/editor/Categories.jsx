import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Calendar from '../common/Calendar';
import { changeCalendarData, changeAssignedCategories } from '../../actions/editor';
import { getAvailableCategories } from '../../actions/common';
import { safeGet } from '../../utils/object_utils';
import CategorySelect from '../common/CategorySelect';

export class ICategories extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    assignedCategories: PropTypes.object.isRequired,
    calendarData: PropTypes.object.isRequired,
    changeCalendarData: PropTypes.func.isRequired,
    getAvailableCategories: PropTypes.func.isRequired,
    changeAssignedCategories: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    const {
      changeCalendarData: changeCalendarDataCall,
      getAvailableCategories: getAvailableCategoriesCall,
      calendarData: { date, view },
      categories,
    } = this.props;
    changeCalendarDataCall(date, view);
    if (!categories.length) getAvailableCategoriesCall();
  };

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
    const { categories, assignedCategories, user } = this.props;
    return (
      <div className={value.length === 0 ? 'd-none' : ''}>
        <CategorySelect
          isMulti
          name="category"
          options={categories.filter(
            option => safeGet(assignedCategories, `${user.id}.all`, []).includes(option.id),
          )}
          onChange={e => this.onSelectChange(obj, date, e)}
          value={categories.filter(option => value.includes(option.id))}
        />
      </div>
    );
  };

  render() {
    const {
      user: { subordinates }, assignedCategories, calendarData, changeCalendarData: changeCalendarDataCall,
    } = this.props;
    return (
      <React.Fragment>
        <Calendar
          objects={subordinates}
          statistics={assignedCategories}
          calendarData={calendarData}
          changeCalendarData={changeCalendarDataCall}
          handleClickCell={this.handleClickCell}
          handleRenderCell={this.handleRenderCell}
          defaultRenderValue={[]}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  assignedCategories: state.editor.assignedCategories,
  calendarData: state.common.calendarData,
  categories: state.common.availableCategories,
});

const Categories = connect(mapStateToProps, {
  changeCalendarData, getAvailableCategories, changeAssignedCategories,
})(ICategories);
export default Categories;
