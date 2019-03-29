import {
  CHIEF_GET_PENDING_QUESTIONS,
  CHIEF_GET_ACTIVE_QUESTIONS,
} from '../actions/types';

const initialState = {
  pendingQuestions: [],
  activeQuestions: [],
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
    default:
      return state;
  }
}
