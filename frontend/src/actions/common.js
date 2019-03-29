import axios from 'axios';
import {
  COMMON_GET_CATEGORIES,
  COMMON_GET_STATISTICS,
} from './types';
import { returnErrors } from './messages';

// GET CATEGORY LIST
export const getCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/')
    .then((res) => {
      dispatch({ type: COMMON_GET_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET STATISTICS
export const getStatistics = (startDate, endDate) => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/statistics/', { params: { start_date: startDate, end_date: endDate } })
    .then((res) => {
      dispatch({ type: COMMON_GET_STATISTICS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
