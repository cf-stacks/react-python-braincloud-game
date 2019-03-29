import axios from 'axios';
import moment from 'moment';

import { returnErrors } from './messages';
import { getStatistics } from './common';

import {
  CHIEF_GET_PENDING_QUESTIONS,
  CHIEF_GET_ACTIVE_QUESTIONS,
  CHIEF_GET_ASSIGNED_CATEGORIES,
  CHIEF_CHANGE_ASSIGNED_CATEGORIES,
  COMMON_CALENDAR_CHANGE,
} from './types';


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
