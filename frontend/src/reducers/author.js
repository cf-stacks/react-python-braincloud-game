import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_ADD_QUESTION,
  AUTHOR_GET_TODAY_LIST,
  AUTHOR_FORM_RESET,
  AUTHOR_FORM_UPDATE,
  AUTHOR_TODAY_CATEGORIES,
} from '../actions/types';

const initialState = {
  statistics: {},
  todayList: [],
  formValues: {
    category: '',
    description: '',
    answerCorrect: '',
    answerIncorrect1: '',
    answerIncorrect2: '',
  },
  categories: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTHOR_GET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case AUTHOR_ADD_QUESTION:
      return {
        ...state,
        todayList: [...state.todayList, action.payload],
      };
    case AUTHOR_GET_TODAY_LIST:
      return {
        ...state,
        todayList: action.payload,
      };
    case AUTHOR_FORM_UPDATE:
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.payload.name]: action.payload.value,
        },
      };
    case AUTHOR_FORM_RESET:
      return {
        ...state,
        formValues: initialState.formValues,
      };
    case AUTHOR_TODAY_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
}
