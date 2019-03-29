import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_ADD_QUESTION,
  AUTHOR_GET_TODAY_LIST,
  AUTHOR_TODAY_CATEGORIES,
} from '../actions/types';

const initialState = {
  statistics: {},
  todayList: [],
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
    case AUTHOR_TODAY_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
}
