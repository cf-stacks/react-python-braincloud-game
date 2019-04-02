import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_GET_TODAY_LIST,

  COMMON_ADD_QUESTION,
} from '../actions/types';

const initialState = {
  statistics: {},
  todayList: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTHOR_GET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case COMMON_ADD_QUESTION:
      return {
        ...state,
        todayList: [...state.todayList, action.payload],
      };
    case AUTHOR_GET_TODAY_LIST:
      return {
        ...state,
        todayList: action.payload,
      };
    default:
      return state;
  }
}
