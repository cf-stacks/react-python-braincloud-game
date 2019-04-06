import {
  AUTHOR_GET_STATISTICS,
  AUTHOR_GET_TODAY_LIST,
  AUTHOR_SET_DEFAULT_CATEGORY,

  COMMON_ADD_QUESTION,
  LOGOUT_SUCCESS,
} from '../actions/types';

const initialState = {
  statistics: {},
  todayList: [],
  defaultCategory: localStorage.getItem('defaultCategory'),
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
    case LOGOUT_SUCCESS:
      return initialState;
    case AUTHOR_SET_DEFAULT_CATEGORY:
      if (!action.payload) localStorage.removeItem('defaultCategory');
      else localStorage.setItem('defaultCategory', action.payload);
      return {
        ...state,
        defaultCategory: action.payload,
      };
    default:
      return state;
  }
}
