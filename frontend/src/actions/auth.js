import axios from "axios";
import { returnErrors } from "./messages";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "./types";

// CHECK TOKEN
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({type: USER_LOADING});
  // Get token
  const access = getState().auth.access;
  const refresh = getState().auth.refresh;
  // Headers
  const config = {
    headers: {
      'Content-Type': "application/json",
    }
  };
  if (access) {
    config.headers['Authorization'] = `CustomJWT ${access}`
    axios
      .get('/api/v1/user/info/', config)
      .then(res => {
        dispatch({type: USER_LOADED, payload: res.data});
      })
      .catch(err => {
        axios
          .post('/api/v1/token/refresh/', {refresh: refresh}, config)
          .then(res => {
            dispatch({type: LOGIN_SUCCESS, payload: res.data});
            dispatch(loadUser());
          })
          .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR, payload: null});
          })
      });
  }
};

// LOGIN USER
export const login = (email, password) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': "application/json",
    }
  };
  // Request body
  const body = JSON.stringify({email, password});

  axios
    .post('/api/v1/user/login/', body, config)
    .then(res => {
      dispatch({type: LOGIN_SUCCESS, payload: res.data});
      dispatch(loadUser());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({type: LOGIN_FAILURE, payload: null});
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
// User loading
  dispatch({type: USER_LOADING});
  // Get token
  const access = getState().auth.access;
  // Headers
  const config = {
    headers: {
      'Content-Type': "application/json",
    }
  };
  if (access) {
    config.headers['Authorization'] = `CustomJWT ${access}`;
    axios
      .post('/api/v1/user/logout/', {}, config)
      .then(() => {
        dispatch({type: LOGOUT_SUCCESS, payload: null});
      })
      .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({type: AUTH_ERROR, payload: null});
      });
  }
};
