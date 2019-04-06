import moment from 'moment';
import {
  COMMON_CREATE_CATEGORY,
  COMMON_CALENDAR_CHANGE,
  COMMON_GET_STATISTICS,
  COMMON_GET_AVAILABLE_CATEGORIES,
  LOGOUT_SUCCESS,
} from '../actions/types';

const initialState = {
  availableCategories: null,
  statistics: {},
  calendarData: {
    date: moment(),
    view: 'isoWeek',
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case COMMON_GET_AVAILABLE_CATEGORIES:
      return {
        ...state,
        availableCategories: action.payload,
      };
    case COMMON_CREATE_CATEGORY:
      return {
        ...state,
        availableCategories: [...state.availableCategories, action.payload].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }),
      };
    case COMMON_CALENDAR_CHANGE:
      return {
        ...state,
        calendarData: action.payload,
      };
    case COMMON_GET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
