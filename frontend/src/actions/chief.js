import axios from 'axios';
import moment from 'moment';

import { t } from '@lingui/macro';
import { createMessage, returnErrors } from './messages';
import { getStatistics } from './common';

import {
  CHIEF_GET_PENDING_QUESTIONS,
  CHIEF_GET_ACTIVE_QUESTIONS,
  CHIEF_GET_STOPPED_QUESTIONS,
  CHIEF_GET_REJECTED_QUESTIONS,
  CHIEF_GET_ACTIVE_CATEGORIES,
  CHIEF_GET_STOPPED_CATEGORIES,
  CHIEF_GET_ASSIGNED_CATEGORIES,
  CHIEF_CHANGE_ASSIGNED_CATEGORIES,
  CHIEF_ACCEPT_QUESTION,
  CHIEF_REJECT_QUESTION,
  CHIEF_DELETE_QUESTION,
  CHIEF_STOP_QUESTION,
  CHIEF_RESUME_QUESTION,
  CHIEF_DELETE_CATEGORY,
  CHIEF_STOP_CATEGORY,
  CHIEF_RESUME_CATEGORY,
  COMMON_CALENDAR_CHANGE,
} from './types';

import { i18n } from '../components/App';

const getDays = (date, view) => moment.range(date.clone().startOf(view), date.clone().endOf(view)).by('days');

// GET PENDING QUESTIONS
export const getPendingQuestions = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/pending/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_PENDING_QUESTIONS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET GAME QUESTIONS
export const getActiveQuestions = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/active/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_ACTIVE_QUESTIONS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET STOPPED QUESTIONS
export const getStoppedQuestions = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/stopped/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_STOPPED_QUESTIONS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET REJECTED QUESTIONS
export const getRejectedQuestions = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/rejected/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_REJECTED_QUESTIONS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};


// GET ASSIGNED CATEGORIES
export const getAssignedCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/assigned/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_ASSIGNED_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// CHANGE ASSIGNED CATEGORIES
export const changeAssignedCategories = (user, value, isDeleted, categories) => (dispatch) => {
  axios({
    method: isDeleted ? 'delete' : 'post',
    url: '/api/internal/quiz/category/assigned/',
    data: { user, categories },
  }).then(() => {
    dispatch({ type: CHIEF_CHANGE_ASSIGNED_CATEGORIES, payload: { user, value } });
  }).catch((err) => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });
};

// CHANGE CALENDAR DATA
export const changeCalendarData = (date, view) => (dispatch) => {
  dispatch({ type: COMMON_CALENDAR_CHANGE, payload: { date, view } });
  const { 0: start, length: l, [l - 1]: end } = [...getDays(date, view)];
  dispatch(getStatistics(start.format('Y-MM-DD'), end.format('Y-MM-DD')));
};

// ACCEPT QUESTION
export const acceptQuestion = question => dispatch => (
  axios
    .post(`/api/internal/quiz/question/${question.id}/accept/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question accepted`) }));
      dispatch({
        type: CHIEF_ACCEPT_QUESTION, payload: res.data,
      });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);

// ACCEPT QUESTION
export const rejectQuestion = question => dispatch => (
  axios
    .post(`/api/internal/quiz/question/${question.id}/reject/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question rejected`) }));
      dispatch({
        type: CHIEF_REJECT_QUESTION, payload: res.data,
      });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);

// DELETE QUESTION
export const deleteQuestion = question => dispatch => (
  axios
    .delete(`/api/internal/quiz/question/${question.id}/`)
    .then(() => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question deleted`) }));
      dispatch({ type: CHIEF_DELETE_QUESTION, payload: question });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);

// STOP QUESTION
export const stopQuestion = question => dispatch => (
  axios
    .post(`/api/internal/quiz/question/${question.id}/stop/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question stopped`) }));
      dispatch({ type: CHIEF_STOP_QUESTION, payload: res.data });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);

// RESUME QUESTION
export const resumeQuestion = question => dispatch => (
  axios
    .post(`/api/internal/quiz/question/${question.id}/resume/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question resumed`) }));
      dispatch({ type: CHIEF_RESUME_QUESTION, payload: res.data });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);

// GET ACTIVE CATEGORIES
export const getActiveCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/active/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_ACTIVE_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET STOPPED CATEGORIES
export const getStoppedCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/stopped/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_STOPPED_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// DELETE QUESTION
export const deleteCategory = category => dispatch => (
  axios
    .delete(`/api/internal/quiz/category/${category.id}/`)
    .then(() => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Category deleted`) }));
      dispatch({ type: CHIEF_DELETE_CATEGORY, payload: category });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);

// STOP QUESTION
export const stopCategory = category => dispatch => (
  axios
    .post(`/api/internal/quiz/category/${category.id}/stop/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Category stopped`) }));
      dispatch({ type: CHIEF_STOP_CATEGORY, payload: res.data });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);

// RESUME QUESTION
export const resumeCategory = category => dispatch => (
  axios
    .post(`/api/internal/quiz/category/${category.id}/resume/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Category resumed`) }));
      dispatch({ type: CHIEF_RESUME_CATEGORY, payload: res.data });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    })
);
