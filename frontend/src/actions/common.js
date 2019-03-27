import axios from 'axios';
import { COMMON_GET_CATEGORIES } from './types';
import { returnErrors } from './messages';

// GET CATEGORY LIST
export const getCategories = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/')
    .then((res) => {
      dispatch({ type: COMMON_GET_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export default getCategories;
