import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_ADD_QUESTION,
  AUTHOR_GET_TODAY_LIST,
  AUTHOR_FORM_RESET,
  AUTHOR_FORM_UPDATE,
  AUTHOR_GET_CATEGORIES,
} from "../actions/types.js"

const initialState = {
  statistics: {},
  todayList: [],
  form_values: {
    category: "",
    description: "",
    answer_correct: "",
    answer_incorrect_1: "",
    answer_incorrect_2: "",
  },
  categories: [],
};

export default function (state=initialState, action) {
  switch (action.type) {
    case AUTHOR_GET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case AUTHOR_ADD_QUESTION:
      return {
        ...state,
        todayList: [...state.todayList, action.payload]
      };
    case AUTHOR_GET_TODAY_LIST:
      return {
        ...state,
        todayList: action.payload,
      };
    case AUTHOR_FORM_UPDATE:
      return {
        ...state,
        form_values: {
          ...state.form_values,
          [action.payload.name]: action.payload.value,
        }
      };
    case AUTHOR_FORM_RESET:
      return {
        ...state,
        form_values: initialState.form_values,
      };
    case AUTHOR_GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
}