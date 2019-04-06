import axios from 'axios';

import { returnErrors } from './messages';

import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_GET_TODAY_LIST,
  AUTHOR_SET_DEFAULT_CATEGORY,
} from './types';

// GET AUTHOR STATISTICS
export const getStatistics = () => (dispatch) => {
  axios
    .get('/api/internal/author/statistics/')
    .then((res) => {
      dispatch({ type: AUTHOR_GET_STATISTICS, payload: res.data });
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

// SET DEFAULT CATEGORY
export const setDefaultCategory = categoryId => (dispatch) => {
  dispatch({ type: AUTHOR_SET_DEFAULT_CATEGORY, payload: categoryId });
};
