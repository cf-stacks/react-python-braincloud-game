import axios from 'axios';
import { t } from '@lingui/macro';

import {
  COMMON_GET_CATEGORIES,
  COMMON_CREATE_CATEGORY,
  COMMON_GET_STATISTICS,
} from './types';
import { createMessage, returnErrors } from './messages';
import { i18n } from '../components/App';

// GET CATEGORY LIST
export const getCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/')
    .then((res) => {
      dispatch({ type: COMMON_GET_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// CREATE CATEGORY
export const createCategory = (name, callback = null) => dispatch => (
  axios
    .post('/api/internal/quiz/category/', { name })
    .then((res) => {
      dispatch(createMessage({ simpleSuccess: i18n._(t`Category "${name}" added`) }));
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
