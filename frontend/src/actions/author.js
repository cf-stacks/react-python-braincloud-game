import axios from "axios";

import cookie from "react-cookies";

import { createMessage, returnErrors } from "./messages";

import {
  GET_AUTHOR_STATISTICS,
  ADD_QUIZ_QUESTION,
  GET_TODAY_LIST,
  RESET_FORM,
  FORM_UPDATE,
  GET_CATEGORIES,
} from "./types";

// GET AUTHOR STATISTICS
export const getStatistics = () => (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': "application/json",
      'Authorization': `CustomJWT ${getState().auth.access}`,
    }
  };
  axios
    .get("/api/internal/author/statistics/", config)
    .then(res => {
      dispatch({type: GET_AUTHOR_STATISTICS, payload: res.data});
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// ADD QUIZ QUESTION
export const addQuizQuestion = (question) => (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': "application/json",
      'Authorization': `CustomJWT ${getState().auth.access}`,
    }
  };
  axios
    .post("/api/internal/quiz/question/", question, config)
    .then(res => {
      // Show notification
      dispatch(createMessage({quizQuestionAdded: 'Question Added'}));
      // Hide errors
      dispatch(returnErrors({}, null));
      // Reset form
      dispatch({type: RESET_FORM, payload: null});
      // Refetch statistics
      dispatch(getStatistics());
      // Add question
      dispatch({type: ADD_QUIZ_QUESTION, payload: res.data});
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// UPDATE FORM
export const formUpdate = (name, value) => dispatch => {
  dispatch({
    type: FORM_UPDATE,
    payload: {
      name: name,
      value: value,
    }
  })
};

// GET TODAY LIST
export const getTodayList = () => (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': "application/json",
      'Authorization': `CustomJWT ${getState().auth.access}`,
    }
  };
  axios
    .get("/api/internal/quiz/question/today/", config)
    .then(res => {
      dispatch({type: GET_TODAY_LIST, payload: res.data});
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const getCategories = () => (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': "application/json",
      'Authorization': `CustomJWT ${getState().auth.access}`,
    }
  };
  axios
    .get("/api/internal/quiz/category/", config)
    .then(res => {
      dispatch({type: GET_CATEGORIES, payload: res.data})
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
