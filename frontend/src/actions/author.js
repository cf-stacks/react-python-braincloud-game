import axios from 'axios';

import { t } from '@lingui/macro';
import { i18n } from '../components/App';

import { createMessage, returnErrors } from './messages';

import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_ADD_QUESTION,
  AUTHOR_GET_TODAY_LIST,
  AUTHOR_FORM_RESET,
  AUTHOR_FORM_UPDATE,
  AUTHOR_TODAY_CATEGORIES,
} from './types';

// GET AUTHOR STATISTICS
export const getStatistics = () => (dispatch) => {
  axios
    .get('/api/internal/author/statistics/')
    .then((res) => {
      dispatch({ type: AUTHOR_GET_STATISTICS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// ADD QUIZ QUESTION
export const addQuizQuestion = question => (dispatch) => {
  axios
    .post('/api/internal/quiz/question/', question)
    .then((res) => {
      // Show notification
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question added`) }));
      // Hide errors
      dispatch(returnErrors({}, null));
      // Reset form
      dispatch({ type: AUTHOR_FORM_RESET, payload: null });
      // Refetch statistics
      dispatch(getStatistics());
      // Add question
      dispatch({ type: AUTHOR_ADD_QUESTION, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// UPDATE FORM
export const formUpdate = (name, value) => (dispatch) => {
  console.log(name, value)
  dispatch({
    type: AUTHOR_FORM_UPDATE,
    payload: {
      name,
      value,
    },
  });
};

// GET TODAY LIST
export const getTodayList = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/today/')
    .then((res) => {
      dispatch({ type: AUTHOR_GET_TODAY_LIST, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET TODAY CATEGORIES
export const getTodayCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/today/')
    .then((res) => {
      dispatch({ type: AUTHOR_TODAY_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
