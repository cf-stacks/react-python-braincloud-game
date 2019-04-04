import moment from 'moment';

import {
  EDITOR_GET_QUESTIONS,
  EDITOR_GET_ASSIGNED_CATEGORIES,
  EDITOR_ACCEPT_QUESTION,
  EDITOR_REJECT_QUESTION,
  EDITOR_CHANGE_ASSIGNED_CATEGORIES,
  LOGOUT_SUCCESS,
} from '../actions/types';
import { safeGet } from '../utils/object_utils';

const initialState = {
  questions: [],
  assignedCategories: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case EDITOR_GET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
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
    case EDITOR_REJECT_QUESTION: {
      const { object: { author, created_at: createdAt, id }, resolution } = action.payload;
      const formatCreatedAt = moment(createdAt).format('Y-MM-DD');
      const statistic = safeGet(state.statistics, `${author}.${formatCreatedAt}`);
      if (statistic) {
        return {
          ...state,
          questions: state.questions.filter(question => question.id !== id),
          statistics: {
            ...state.statistics,
            [author]: {
              ...state.statistics[author],
              [formatCreatedAt]: {
                new: state.statistics[author][formatCreatedAt].new - 1,
                accepted: state.statistics[author][formatCreatedAt].accepted + (resolution === 'accept' ? 1 : 0),
                rejected: state.statistics[author][formatCreatedAt].rejected + (resolution === 'reject' ? 1 : 0),
              },
            },
          },
        };
      }
      return {
        ...state,
        questions: state.questions.filter(question => question.id !== action.payload.object.id),
      };
    }
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
