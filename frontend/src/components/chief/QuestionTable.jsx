import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { t, Trans } from '@lingui/macro';

import {
  getStoppedQuestions,
  getPendingQuestions,
  getActiveQuestions,
  getRejectedQuestions,
} from '../../actions/chief';
import QuestionTab from './QuestionTab';
import { i18n } from '../App';

export class IStoppedTable extends React.Component {
  static propTypes = {
    stoppedQuestions: PropTypes.array.isRequired,
    pendingQuestions: PropTypes.array.isRequired,
    activeQuestions: PropTypes.array.isRequired,
    rejectedQuestions: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getStoppedQuestions: PropTypes.func.isRequired,
    getPendingQuestions: PropTypes.func.isRequired,
    getActiveQuestions: PropTypes.func.isRequired,
    getRejectedQuestions: PropTypes.func.isRequired,
  };

  state = {
    search: {
      description: '',
      category: '',
      answer: '',
    },
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      ...prevState,
      search: {
        ...prevState.search,
        [name]: value,
      },
    }));
  };

  render() {
    let {
      stoppedQuestions,
      activeQuestions,
      pendingQuestions,
      rejectedQuestions,
    } = this.props;
    const {
      user: { subordinates },
      getStoppedQuestions: getStoppedQuestionsCall,
      getPendingQuestions: getPendingQuestionsCall,
      getActiveQuestions: getActiveQuestionsCall,
      getRejectedQuestions: getRejectedQuestionsCall,
    } = this.props;
    const { search } = this.state;
    if (search.description || search.category || search.answer) {
      const filterQuestions = (arr) => {
        const nameRe = new RegExp(search.description, 'i');
        const categoryRe = new RegExp(search.category, 'i');
        const answerRe = new RegExp(search.answer, 'i');
        return arr.filter(question => (
          question.description.match(nameRe)
          && question.category.name.match(categoryRe)
          && (
            question.answer_correct.match(answerRe)
            || question.answer_incorrect_1.match(answerRe)
            || question.answer_incorrect_2.match(answerRe)
          )
        ));
      };
      stoppedQuestions = filterQuestions(stoppedQuestions);
      activeQuestions = filterQuestions(activeQuestions);
      pendingQuestions = filterQuestions(pendingQuestions);
      rejectedQuestions = filterQuestions(rejectedQuestions);
    }
    return (
      <React.Fragment>
        <div className="jumbotron p-3">
          <h1 className="text-center"><Trans>Questions</Trans></h1>
          <hr />
          <div className="d-flex flex-row justify-content-center">
            <strong>
              <Trans>Filters</Trans>
              :
            </strong>
          </div>
          <div className="d-flex flex-row justify-content-center">
            <div>
              <input
                className="form-control"
                type="text"
                name="description"
                placeholder={i18n._(t`Description`)}
                onChange={this.onChange}
              />
            </div>
            <div>
              <input
                className="form-control"
                type="text"
                name="category"
                placeholder={i18n._(t`Category`)}
                onChange={this.onChange}
              />
            </div>
            <div>
              <input
                className="form-control"
                type="text"
                name="answer"
                placeholder={i18n._(t`Answers`)}
                onChange={this.onChange}
              />
            </div>
          </div>
          <Tabs
            defaultActiveKey="pending"
            className="py-3"
          >
            <Tab eventKey="pending" title={`${i18n._(t`Pending`)} (${pendingQuestions.length})`}>
              <QuestionTab
                count={5}
                users={subordinates}
                questions={pendingQuestions}
                getQuerySet={getPendingQuestionsCall}
                allowActions={{
                  delete: true, edit: true, accept: true, reject: true,
                }}
              />
            </Tab>
            <Tab eventKey="active" title={`${i18n._(t`In game`)} (${activeQuestions.length})`}>
              <QuestionTab
                count={5}
                users={subordinates}
                questions={activeQuestions}
                getQuerySet={getActiveQuestionsCall}
                allowActions={{
                  stop: true,
                }}
              />
            </Tab>
            <Tab eventKey="stopped" title={`${i18n._(t`Stopped`)} (${stoppedQuestions.length})`}>
              <QuestionTab
                count={5}
                users={subordinates}
                questions={stoppedQuestions}
                getQuerySet={getStoppedQuestionsCall}
                allowActions={{
                  delete: true, edit: true, resume: true,
                }}
              />
            </Tab>
            <Tab eventKey="rejected" title={`${i18n._(t`Rejected`)} (${rejectedQuestions.length})`}>
              <QuestionTab
                count={5}
                users={subordinates}
                questions={rejectedQuestions}
                getQuerySet={getRejectedQuestionsCall}
                allowActions={{
                  delete: true,
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
  stoppedQuestions: state.chief.stoppedQuestions,
  activeQuestions: state.chief.activeQuestions,
  pendingQuestions: state.chief.pendingQuestions,
  rejectedQuestions: state.chief.rejectedQuestions,
  user: state.auth.user,
});

const StoppedTable = connect(mapStateToProps, {
  getStoppedQuestions,
  getPendingQuestions,
  getActiveQuestions,
  getRejectedQuestions,
})(IStoppedTable);
export default StoppedTable;
