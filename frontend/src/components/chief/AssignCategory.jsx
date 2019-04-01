import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { getCategories, createCategory } from '../../actions/common';
import { getAssignedCategories, changeAssignedCategories } from '../../actions/chief';
import { safeGet } from '../../utils/object_utils';
import CategorySelect from '../common/CategorySelect';

export class IAssignCategory extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    assignedCategories: PropTypes.object.isRequired,
    getCategories: PropTypes.func.isRequired,
    createCategory: PropTypes.func.isRequired,
    getAssignedCategories: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    const { getCategories: getCategoriesCall, getAssignedCategories: getAssignedCategoriesCall } = this.props;
    getCategoriesCall();
    getAssignedCategoriesCall();
  };

  onCreateOption = (obj, inputValue) => {
    const { createCategory: createCategoryCall, assignedCategories, categories } = this.props;
    const lst = safeGet(assignedCategories, obj, []);
    createCategoryCall(inputValue, data => this.onSelectChange(
      obj, [...categories.filter(x => lst.includes(x.id)), data],
    ));
  };

  onSelectChange = (obj, value) => {
    const { assignedCategories, changeAssignedCategories: changeAssignedCategoriesCall } = this.props;
    const lst = safeGet(assignedCategories, obj, []);
    let items = lst.filter(x => !value.map(v => v.id).includes(x));
    let isDeleted = false;
    if (items.length !== 0) isDeleted = true;
    else items = value.map(v => v.id).filter(x => !lst.includes(x));
    changeAssignedCategoriesCall(obj, value, isDeleted, items);
  };

  renderCell = (id) => {
    const { categories, assignedCategories } = this.props;
    const value = safeGet(assignedCategories, id, []);
    return (
      <CategorySelect
        isCreatable
        isMulti
        name="category"
        options={categories}
        onCreateOption={e => this.onCreateOption(id, e)}
        onChange={e => this.onSelectChange(id, e)}
        value={categories.filter(option => value.includes(option.id))}
      />
    );
  };

  render = () => {
    const { user } = this.props;

    return (
      <React.Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Assigned categories</Trans></h1>
          <hr />
          <table className="table table-striped table-sm">
            <tbody className="thead-dark">
              { user.subordinates.map(subordinate => (
                <tr key={subordinate.id}>
                  <th className="text-center align-middle" style={{ width: '20%' }}>
                    {subordinate.name}
                  </th>
                  <td>
                    { this.renderCell(subordinate.id) }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  };
}

const mapStateToProps = state => ({
  user: state.auth.user,
  assignedCategories: state.chief.assignedCategories,
  categories: state.common.categories,
});

const AssignCategory = connect(mapStateToProps, {
  getCategories,
  createCategory,
  getAssignedCategories,
  changeAssignedCategories,
})(IAssignCategory);
export default AssignCategory;
