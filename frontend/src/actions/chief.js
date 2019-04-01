import axios from 'axios';
import moment from 'moment';

import { t } from '@lingui/macro';
import { createMessage, returnErrors } from './messages';
import { getStatistics } from './common';

import {
  CHIEF_GET_PENDING_QUESTIONS,
  CHIEF_GET_ACTIVE_QUESTIONS,
  CHIEF_GET_STOPPED_QUESTIONS,
  CHIEF_GET_ASSIGNED_CATEGORIES,
  CHIEF_CHANGE_ASSIGNED_CATEGORIES,
  CHIEF_ACCEPT_QUESTION,
  CHIEF_REJECT_QUESTION,
  CHIEF_DELETE_QUESTION,
  CHIEF_STOP_QUESTION,
  CHIEF_RESUME_QUESTION,
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

// GET PAUSED QUESTIONS
export const getStoppedQuestions = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/stopped/')
    .then((res) => {
      dispatch({ type: CHIEF_GET_STOPPED_QUESTIONS, payload: res.data });
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

// SUBMIT REVIEW (ACCEPT OR REJECT)
export const submitReview = (questionId, resolution) => (dispatch) => {
  axios
    .post(`/api/internal/quiz/question/${questionId}/${resolution}/`)
    .then((res) => {
      dispatch(createMessage({
        simpleSuccess: resolution === 'accept' ? i18n._(t`Question accepted`) : i18n._(t`Question rejected`),
      }));
      dispatch({
        type: resolution === 'accept' ? CHIEF_ACCEPT_QUESTION : CHIEF_REJECT_QUESTION,
        payload: { resolution, object: res.data },
      });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// DELETE QUESTION
export const deleteQuestion = questionId => (dispatch) => {
  axios
    .delete(`/api/internal/quiz/question/${questionId}/`)
    .then(() => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question deleted`) }));
      dispatch({type: CHIEF_DELETE_QUESTION, payload: { questionId }});
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// STOP QUESTION
export const stopQuestion = questionId => (dispatch) => {
  axios
    .post(`/api/internal/quiz/question/${questionId}/stop/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question stopped`) }));
      dispatch({type: CHIEF_STOP_QUESTION, payload: res.data });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// RESUME QUESTION
export const resumeQuestion = questionId => (dispatch) => {
  axios
    .post(`/api/internal/quiz/question/${questionId}/resume/`)
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question resumed`) }));
      dispatch({type: CHIEF_RESUME_QUESTION, payload: res.data });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
