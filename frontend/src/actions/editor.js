import axios from "axios";

import { createMessage, returnErrors } from "./messages";

import {
  EDITOR_GET_QUESTIONS,
} from "./types";

export const getQuestions = () => dispatch => {
  axios
    .get("/api/internal/quiz/question/pending/")
    .then(res => {
      dispatch({type: EDITOR_GET_QUESTIONS, payload: res.data})
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
