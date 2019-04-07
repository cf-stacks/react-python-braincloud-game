import axios from 'axios';
import { returnErrors } from './messages';

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  TOKEN_REFRESHED,
} from './types';

// CHECK TOKEN
export const loadUser = () => (dispatch) => {
  // User loading
  dispatch({ type: USER_LOADING });
  axios
    .get('/api/v1/user/info/')
    .then((res) => {
      dispatch({ type: USER_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR, payload: null });
    });
};

// REFRESH TOKEN
export const doRefreshToken = refreshToken => dispatch => axios
  .post('/api/v1/token/refresh/', { refresh: refreshToken })
  .then((res) => {
    dispatch({ type: TOKEN_REFRESHED, payload: { authToken: res.data.access, refreshToken: res.data.refresh } });
  })
  .catch((err) => {
    dispatch(returnErrors(err.response.data, err.response.status));
    dispatch({ type: AUTH_ERROR, payload: null });
  });

// LOGIN USER
export const login = (email, password) => (dispatch) => {
  // Request body
  // const body = JSON.stringify({email, password});
  axios
    .post('/api/v1/user/login/', { email, password })
    .then((res) => {
      dispatch({ type: LOGIN_SUCCESS, payload: { authToken: res.data.access, refreshToken: res.data.refresh } });
      dispatch(loadUser());
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: LOGIN_FAILURE, payload: null });
    });
};

// LOGOUT USER
export const logout = () => (dispatch) => {
  axios
    .post('/api/v1/user/logout/')
    .then(() => {
      dispatch({ type: LOGOUT_SUCCESS, payload: null });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR, payload: null });
    });
};
