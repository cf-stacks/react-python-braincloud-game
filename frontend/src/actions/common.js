import axios from 'axios';
import { t } from '@lingui/macro';

import {
  COMMON_CREATE_CATEGORY,
  COMMON_GET_STATISTICS,
  COMMON_ADD_QUESTION,
  COMMON_EDIT_QUESTION,
  COMMON_GET_AVAILABLE_CATEGORIES,
} from './types';
import { createMessage, returnErrors } from './messages';
import { setDefaultCategory, getStatistics as getAuthorStatistics } from './author';
import { i18n } from '../components/App';

// CREATE CATEGORY
export const createCategory = (name, callback = null) => dispatch => (
  axios
    .post('/api/internal/quiz/category/', { name })
    .then((res) => {
      dispatch(createMessage({ success: i18n._(t`Category "${name}" added`) }));
      dispatch({ type: COMMON_CREATE_CATEGORY, payload: res.data });
      if (callback) callback(res.data);
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
);

// GET STATISTICS
export const getStatistics = (startDate, endDate) => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/statistics/', { params: { start_date: startDate, end_date: endDate } })
    .then((res) => {
      dispatch({ type: COMMON_GET_STATISTICS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// ADD QUIZ QUESTION
export const addQuizQuestion = (data, callback = null) => (dispatch) => {
  axios
    .post('/api/internal/quiz/question/', data)
    .then((res) => {
      // Show notification
      dispatch(createMessage({ success: i18n._(t`Question added`) }));
      // Hide errors
      dispatch(returnErrors({}, null));
      // Refetch statistics
      dispatch(getAuthorStatistics());
      // Save default category
      dispatch(setDefaultCategory(res.data.category.id));
      // Add question
      dispatch({ type: COMMON_ADD_QUESTION, payload: res.data });
      if (callback) callback();
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const editQuizQuestion = (questionId, data, callback = null) => (dispatch) => {
  axios
    .put(`/api/internal/quiz/question/${questionId}/`, data)
    .then((res) => {
      // Show notification
      dispatch(createMessage({ success: i18n._(t`Question updated`) }));
      // Hide errors
      dispatch(returnErrors({}, null));
      dispatch({ type: COMMON_EDIT_QUESTION, payload: res.data });
      if (callback) callback();
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET AVAILABLE CATEGORIES
export const getAvailableCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/available/')
    .then((res) => {
      dispatch({ type: COMMON_GET_AVAILABLE_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
