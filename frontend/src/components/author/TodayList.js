import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTodayList } from "../../actions/author";

export class TodayList extends Component {
  static propTypes = {
    todayList: PropTypes.array.isRequired,
    getTodayList: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  };

  componentDidMount = () => {
    this.props.getTodayList();
  };

  getValue = (id) => {
    const found = this.props.categories.find((elem) => elem.id === id)
    return found ? found.name : null
  }

  render () {
    return (
      <Fragment>
        <h1>Today added</h1>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Correct answer</th>
              <th>Incorrect answer 1</th>
              <th>Incorrect answer 2</th>
            </tr>
          </thead>
          <tbody>
          { this.props.todayList.map(question => (
            <tr key={ question.id }>
              <td>{ question.description }</td>
              <td>{ this.getValue(question.category) }</td>
              <td>{ question.answer_correct }</td>
              <td>{ question.answer_incorrect_1 }</td>
              <td>{ question.answer_incorrect_2 }</td>
            </tr>
          ))}
          </tbody>
        </table>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  todayList: state.author.todayList,
  categories: state.author.categories,
});

export default connect(mapStateToProps, { getTodayList })(TodayList);
