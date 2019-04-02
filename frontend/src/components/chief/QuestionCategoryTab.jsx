import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import {
  deleteCategory,
  stopCategory,
  resumeCategory,
} from '../../actions/chief';

export class IQuestionTab extends React.Component {
  static propTypes = {
    count: PropTypes.number,
    categories: PropTypes.array.isRequired,
    allowActions: PropTypes.object,
    getQuerySet: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
    resumeCategory: PropTypes.func.isRequired,
    stopCategory: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
    };
  }

  componentDidMount() {
    const { getQuerySet: getQuerySetCall, categories } = this.props;
    if (!categories.length) getQuerySetCall();
  }

  onClickSeeMore = () => {
    this.setState({ count: null });
  };

  render() {
    const {
      categories,
      allowActions,
      deleteCategory: deleteCategoryCall,
      resumeCategory: resumeCategoryCall,
      stopCategory: stopCategoryCall,
    } = this.props;
    const { count } = this.state;
    let userCategories = categories;
    let seeAll = null;
    if (count && userCategories.length > count) {
      userCategories = userCategories.slice(0, count);
      seeAll = (
        <tr>
          <td colSpan="4" className="p-2">
            <div className="text-center">
              <button type="button" onClick={this.onClickSeeMore} className="btn btn-outline-secondary">
                <Trans>See all</Trans>
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <table className="table table-striped table-sm">
        <thead className="thead-dark">
          <tr>
            <th className="text-center" style={{ width: '10%' }}>#</th>
            <th className="text-center" style={{ width: '20%' }}><Trans>Actions</Trans></th>
            <th className="text-center" style={{ width: '70%' }}><Trans>Name</Trans></th>
          </tr>
        </thead>
        <tbody>
          { userCategories.map((category, index) => (
            <tr key={category.id}>
              <th className="p-2 align-middle">
                <div>{ index + 1}</div>
              </th>
              <td className="p-2 align-middle">
                <div className="d-flex flex-row justify-content-center">
                  { allowActions.stop ? (
                    <button
                      type="button"
                      className="btn btn-danger rounded-circle border border-secondary my-1"
                      onClick={() => stopCategoryCall(category)}
                    >
                      <i className="fas fa-stop" />
                    </button>
                  ) : (
                    null
                  )}
                  { allowActions.resume ? (
                    <button
                      type="button"
                      className="btn btn-success rounded-circle border border-secondary my-1"
                      onClick={() => resumeCategoryCall(category)}
                    >
                      <i className="fas fa-play" />
                    </button>
                  ) : (
                    null
                  )}
                  { allowActions.edit ? (
                    <Link
                      className="btn btn-primary rounded-circle border border-secondary my-1"
                      to={`/category/${category.id}`}
                    >
                      <i className="fas fa-edit" />
                    </Link>
                  ) : (
                    null
                  )}
                  { allowActions.delete ? (
                    <button
                      type="button"
                      className="btn btn-danger rounded-circle border border-secondary my-1"
                      onClick={() => deleteCategoryCall(category)}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  ) : (
                    null
                  )}
                </div>
              </td>
              <td className="p-2 align-middle">
                <div className="text-justify">{ category.name }</div>
              </td>
            </tr>
          )) }
          { seeAll }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state, parentProps) => ({
  allowActions: parentProps.allowActions || {},
});

const QuestionTab = IQuestionTab;
export default connect(mapStateToProps, {
  deleteCategory,
  resumeCategory,
  stopCategory,
})(QuestionTab);
