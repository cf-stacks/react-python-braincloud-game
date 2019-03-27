import moment from 'moment';

import {
  EDITOR_GET_QUESTIONS,
  EDITOR_GET_STATISTICS,
  EDITOR_CALENDAR_CHANGE,
  EDITOR_GET_ASSIGNED_CATEGORIES,
  EDITOR_ACCEPT_QUESTION,
  EDITOR_REJECT_QUESTION,
  EDITOR_CHANGE_ASSIGNED_CATEGORIES,
} from '../actions/types';
import { safeGet } from '../utils/object_utils';

const initialState = {
  questions: [],
  statistics: {},
  assignedCategories: {},
  calendarData: {
    date: moment(),
    view: 'isoWeek',
  },
};

export default function (state = initialState, action) {
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
        calendarData: action.payload,
      };
    case EDITOR_GET_ASSIGNED_CATEGORIES:
      return {
        ...state,
        assignedCategories: action.payload,
      };
    case EDITOR_CHANGE_ASSIGNED_CATEGORIES:
      return {
        ...state,
        assignedCategories: {
          ...state.assignedCategories,
          [action.payload.user]: {
            ...state.assignedCategories[action.payload.user],
            [action.payload.date]: action.payload.value.map(x => x.id),
          },
        },
      };
    case EDITOR_ACCEPT_QUESTION:
    case EDITOR_REJECT_QUESTION:
      const author = action.payload.object.author;
      const createdAt = moment(action.payload.object.created_at).format('Y-MM-DD');
      const statistic = safeGet(state.statistics, `${author}.${createdAt}`);
      if (statistic) {
        return {
          ...state,
          questions: state.questions.filter(question => question.id !== action.payload.object.id),
          statistics: {
            ...state.statistics,
            [author]: {
              ...state.statistics[author],
              [createdAt]: {
                new: state.statistics[author][createdAt].new - 1,
                accepted: state.statistics[author][createdAt].accepted + (action.payload.resolution === 'accept' ? 1 : 0),
                rejected: state.statistics[author][createdAt].rejected + (action.payload.resolution === 'reject' ? 1 : 0),
              },
            },
          },
        };
      }
      return {
        ...state,
        questions: state.questions.filter(question => question.id !== action.payload.object.id),
      };
    default:
      return state;
  }
}
