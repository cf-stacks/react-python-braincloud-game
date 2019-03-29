import axios from 'axios';
import moment from 'moment';

import { t } from '@lingui/macro';
import { createMessage, returnErrors } from './messages';
import { getStatistics } from './common';

import {
  EDITOR_GET_QUESTIONS,
  EDITOR_GET_ASSIGNED_CATEGORIES,
  EDITOR_CHANGE_ASSIGNED_CATEGORIES,
  EDITOR_ACCEPT_QUESTION,
  EDITOR_REJECT_QUESTION,
  COMMON_CALENDAR_CHANGE,
} from './types';

import { i18n } from '../components/App';

const getDays = (date, view) => moment.range(date.clone().startOf(view), date.clone().endOf(view)).by('days');

// GET PENDING QUESTIONS
export const getQuestions = () => (dispatch) => {
  axios
    .get('/api/internal/quiz/question/pending/')
    .then((res) => {
      dispatch({ type: EDITOR_GET_QUESTIONS, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// GET ASSIGNED CATEGORIES
export const getAssignedCategories = (startDate, endDate) => (dispatch) => {
  axios
    .get('/api/internal/quiz/category/assigned/', { params: { start_date: startDate, end_date: endDate } })
    .then((res) => {
      dispatch({ type: EDITOR_GET_ASSIGNED_CATEGORIES, payload: res.data });
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

// CHANGE ASSIGNED CATEGORIES
export const changeAssignedCategories = (user, date, value, isDeleted, categories) => (dispatch) => {
  axios({
    method: isDeleted ? 'delete' : 'post',
    url: '/api/internal/quiz/category/assigned/',
    data: { user, date, categories },
  }).then(() => {
    dispatch({ type: EDITOR_CHANGE_ASSIGNED_CATEGORIES, payload: { user, date, value } });
  }).catch((err) => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });
};

// CHANGE CALENDAR DATA
export const changeCalendarData = (date, view) => (dispatch) => {
  dispatch({ type: COMMON_CALENDAR_CHANGE, payload: { date, view } });
  const { 0: start, length: l, [l - 1]: end } = [...getDays(date, view)];
  dispatch(getStatistics(start.format('Y-MM-DD'), end.format('Y-MM-DD')));
  dispatch(getAssignedCategories(start.format('Y-MM-DD'), end.format('Y-MM-DD')));
};

// SUBMIT REVIEW (ACCEPT OR REJECT)
export const submitReview = (questionId, resolution) => (dispatch) => {
  axios
    .post(`/api/internal/quiz/question/${questionId}/${resolution}/`)
    .then((res) => {
      dispatch(createMessage({
        simpleSuccess: resolution === 'accept' ? i18n._(t`Question accepted`) : i18n._(t`Question rejected`),
      }));
      dispatch({
        type: resolution === 'accept' ? EDITOR_ACCEPT_QUESTION : EDITOR_REJECT_QUESTION,
        payload: { resolution, object: res.data },
      });
    }).catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
