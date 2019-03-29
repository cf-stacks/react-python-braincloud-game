import axios from 'axios';

import { t } from '@lingui/macro';
import { i18n } from '../components/App';

import { createMessage, returnErrors } from './messages';

import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_ADD_QUESTION,
  AUTHOR_GET_TODAY_LIST,
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
export const addQuizQuestion = (data, callback=null) => (dispatch) => {
  axios
    .post('/api/internal/quiz/question/', data)
    .then((res) => {
      // Show notification
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question added`) }));
      // Hide errors
      dispatch(returnErrors({}, null));
      // Refetch statistics
      dispatch(getStatistics());
      // Add question
      dispatch({ type: AUTHOR_ADD_QUESTION, payload: res.data });
      if (callback) callback()
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const editQuizQuestion = (questionId, data, callback=null) => (dispatch) => {
  axios
    .put(`/api/internal/quiz/question/${questionId}/`, data)
    .then((res) => {
      // Show notification
      dispatch(createMessage({ simpleSuccess: i18n._(t`Question updated`) }));
      // Hide errors
      dispatch(returnErrors({}, null));
      if (callback) callback()
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
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
