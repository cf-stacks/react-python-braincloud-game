import axios from "axios";
import moment from 'moment';

import { createMessage, returnErrors } from "./messages";

import {
  EDITOR_GET_QUESTIONS,
  EDITOR_GET_STATISTICS,
  EDITOR_CALENDAR_CHANGE,
} from "./types";

const getDays = (date, view) => {
  return moment.range(date.clone().startOf(view), date.clone().endOf(view)).by('days');
};

// GET PENDING QUESTIONS
export const getQuestions = () => dispatch => {
  axios
    .get("/api/internal/quiz/question/pending/")
    .then(res => {
      dispatch({type: EDITOR_GET_QUESTIONS, payload: res.data})
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET STATISTICS
export const getStatistics = (start_date, end_date) => dispatch => {
  axios
    .get("/api/internal/quiz/question/statistics/", {params: {start_date, end_date}})
    .then(res => {
      dispatch({type: EDITOR_GET_STATISTICS, payload: res.data})
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// CHANGE CALENDAR DATA
export const changeCalendarData = (date, view) => dispatch => {
  dispatch({type: EDITOR_CALENDAR_CHANGE, payload: {date, view}});
  const {0 : start ,length : l, [l - 1] : end} = [...getDays(date, view)];
  dispatch(getStatistics(start.format("Y-MM-DD"), end.format("Y-MM-DD")));
};
