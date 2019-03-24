import moment from "moment";

import {
  EDITOR_GET_QUESTIONS,
  EDITOR_GET_STATISTICS,
  EDITOR_CALENDAR_CHANGE,
  EDITOR_GET_ASSIGNED_CATEGORIES,
  EDITOR_ACCEPT_QUESTION,
  EDITOR_REJECT_QUESTION,
} from "../actions/types.js"
import {EDITOR_CHANGE_ASSIGNED_CATEGORIES} from "../actions/types";

const initialState = {
  questions: [],
  statistics: {},
  assignedCategories: {},
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
    case EDITOR_GET_ASSIGNED_CATEGORIES:
      return {
        ...state,
        assignedCategories: action.payload,
      };
    case EDITOR_CHANGE_ASSIGNED_CATEGORIES:
      let obj_id, date, value;
      for (let o in action.payload) for (let d in action.payload[o]) obj_id = o, date = d, value = action.payload[obj_id][date].map(x => x.id)
      return {
        ...state,
        assignedCategories: {
          ...state.assignedCategories,
          [obj_id]: {
            ...state.assignedCategories[obj_id],
            [date]: value
          }
        }
      };
    case EDITOR_ACCEPT_QUESTION:
    case EDITOR_REJECT_QUESTION:
      return {
        ...state,
        questions: state.questions.filter(question => question.id !== action.payload.id),
      };

    default:
      return state;
  }
}