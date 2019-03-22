import moment from "moment";

import {
  EDITOR_GET_QUESTIONS,
  EDITOR_GET_STATISTICS,
  EDITOR_CALENDAR_CHANGE,
} from "../actions/types.js"

const initialState = {
  questions: [],
  statistics: {},
  categorySchedule: {},
  calendarData: {
    date: moment(),
    view: "isoWeek",
  },
};

export default function (state=initialState, action) {
  switch (action.type) {
    case EDITOR_GET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };
    case EDITOR_GET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case EDITOR_CALENDAR_CHANGE:
      return {
        ...state,
        calendarData: action.payload
      };
    default:
      return state;
  }
}