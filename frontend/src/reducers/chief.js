import {
  CHIEF_GET_PENDING_QUESTIONS,
  CHIEF_GET_ACTIVE_QUESTIONS,
  CHIEF_GET_ASSIGNED_CATEGORIES,
  CHIEF_CHANGE_ASSIGNED_CATEGORIES,
} from '../actions/types';

const initialState = {
  pendingQuestions: [],
  activeQuestions: [],
  assignedCategories: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHIEF_GET_PENDING_QUESTIONS:
      return {
        ...state,
        pendingQuestions: action.payload,
      };
    case CHIEF_GET_ACTIVE_QUESTIONS:
      return {
        ...state,
        activeQuestions: action.payload,
      };
    case CHIEF_GET_ASSIGNED_CATEGORIES:
      return {
        ...state,
        assignedCategories: action.payload,
      };
    case CHIEF_CHANGE_ASSIGNED_CATEGORIES:
      return {
        ...state,
        assignedCategories: {
          ...state.assignedCategories,
          [action.payload.user]: action.payload.value.map(x => x.id),
        },
      };
    default:
      return state;
  }
}
