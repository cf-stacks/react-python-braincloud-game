import moment from 'moment';
import {
  COMMON_GET_CATEGORIES,
  COMMON_CREATE_CATEGORY,
  COMMON_CALENDAR_CHANGE,
  COMMON_GET_STATISTICS,
} from '../actions/types';

const initialState = {
  categories: [],
  statistics: {},
  calendarData: {
    date: moment(),
    view: 'isoWeek',
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case COMMON_GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case COMMON_CREATE_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload].sort((a, b) => {
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
    default:
      return state;
  }
}
