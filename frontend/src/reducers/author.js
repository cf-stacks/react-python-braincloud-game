import {
  GET_AUTHOR_STATISTICS,
  ADD_QUIZ_QUESTION,
  GET_TODAY_LIST,
  RESET_FORM,
  FORM_UPDATE,
  GET_CATEGORIES,
} from "../actions/types.js"

const initialState = {
  statistics: [],
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
    case GET_AUTHOR_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case ADD_QUIZ_QUESTION:
      return {
        ...state,
        todayList: [...state.todayList, action.payload]
      };
    case GET_TODAY_LIST:
      return {
        ...state,
        todayList: action.payload,
      };
    case FORM_UPDATE:
      return {
        ...state,
        form_values: {
          ...state.form_values,
          [action.payload.name]: action.payload.value,
        }
      };
    case RESET_FORM:
      return {
        ...state,
        form_values: initialState.form_values,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
}