import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { t, Trans } from '@lingui/macro';

import {
  getActiveCategories,
  getStoppedCategories,
} from '../../actions/chief';
import {
  createCategory,
} from '../../actions/common';
import QuestionCategoryTab from './QuestionCategoryTab';
import { i18n } from '../App';

export class IStoppedTable extends React.Component {
  static propTypes = {
    activeCategories: PropTypes.array.isRequired,
    stoppedCategories: PropTypes.array.isRequired,
    getActiveCategories: PropTypes.func.isRequired,
    getStoppedCategories: PropTypes.func.isRequired,
    createCategory: PropTypes.func.isRequired,
  };

  state = {
    search: {
      name: '',
    },
    form: {
      name: '',
    },
  };

  onChangeSearch = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      ...prevState,
      search: {
        ...prevState.search,
        [name]: value,
      },
    }));
  };

  onChangeForm = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };

  onSubmitForm = () => {
    const { createCategory: createCategoryCall } = this.props;
    const { form: { name } } = this.state;
    if (name) createCategoryCall(name);
  };

  render() {
    let {
      activeCategories,
      stoppedCategories,
    } = this.props;
    const {
      getActiveCategories: getActiveCategoriesCall,
      getStoppedCategories: getStoppedCategoriesCall,
    } = this.props;
    const { search } = this.state;
    if (search.name) {
      const filterCategories = (arr) => {
        const nameRe = new RegExp(search.name, 'i');
        return arr.filter(category => category.name.match(nameRe));
      };
      activeCategories = filterCategories(activeCategories);
      stoppedCategories = filterCategories(stoppedCategories);
    }
    return (
      <React.Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Categories</Trans></h1>
          <hr />
          <div className="d-flex flex-row justify-content-around">
            <div>
              <div className="d-flex flex-row justify-content-center">
                <strong>
                  <Trans>Filters</Trans>
                  :
                </strong>
              </div>
              <div>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  placeholder={i18n._(t`Name`)}
                  onChange={this.onChangeSearch}
                />
              </div>
            </div>
            <div>
              <div className="d-flex flex-row justify-content-center">
                <strong>
                  <Trans>Add</Trans>
                  :
                </strong>
              </div>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder={i18n._(t`Name`)}
                    onChange={this.onChangeForm}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary rounded-circle border border-secondary my-1"
                  onClick={this.onSubmitForm}
                >
                  <i className="fas fa-plus" />
                </button>
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey="active"
            className="py-3"
          >
            <Tab eventKey="active" title={`${i18n._(t`In game`)} (${activeCategories.length})`}>
              <QuestionCategoryTab
                count={5}
                categories={activeCategories}
                getQuerySet={getActiveCategoriesCall}
                allowActions={{
                  stop: true,
                }}
              />
            </Tab>
            <Tab eventKey="stopped" title={`${i18n._(t`Stopped`)} (${stoppedCategories.length})`}>
              <QuestionCategoryTab
                count={5}
                categories={stoppedCategories}
                getQuerySet={getStoppedCategoriesCall}
                allowActions={{
                  resume: true, delete: true,
                }}
              />
            </Tab>
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  activeCategories: state.chief.activeCategories,
  stoppedCategories: state.chief.stoppedCategories,
});

const StoppedTable = connect(mapStateToProps, {
  getActiveCategories,
  getStoppedCategories,
  createCategory,
})(IStoppedTable);
export default StoppedTable;
