import moment from 'moment';
import {
  COMMON_GET_CATEGORIES,
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
