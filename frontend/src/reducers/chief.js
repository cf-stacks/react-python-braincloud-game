import {
  CHIEF_GET_PENDING_QUESTIONS,
  CHIEF_GET_ACTIVE_QUESTIONS,
  CHIEF_GET_STOPPED_QUESTIONS,
  CHIEF_GET_REJECTED_QUESTIONS,
  CHIEF_GET_ACTIVE_CATEGORIES,
  CHIEF_GET_STOPPED_CATEGORIES,
  CHIEF_GET_ASSIGNED_CATEGORIES,
  CHIEF_CHANGE_ASSIGNED_CATEGORIES,
  CHIEF_ACCEPT_QUESTION,
  CHIEF_REJECT_QUESTION,
  CHIEF_DELETE_QUESTION,
  CHIEF_RESUME_QUESTION,
  CHIEF_STOP_QUESTION,
  CHIEF_DELETE_CATEGORY,
  CHIEF_RESUME_CATEGORY,
  CHIEF_STOP_CATEGORY, COMMON_CREATE_CATEGORY,
} from '../actions/types';

const initialState = {
  pendingQuestions: [],
  activeQuestions: [],
  stoppedQuestions: [],
  rejectedQuestions: [],
  activeCategories: [],
  stoppedCategories: [],
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
    case CHIEF_GET_STOPPED_QUESTIONS:
      return {
        ...state,
        stoppedQuestions: action.payload,
      };
    case CHIEF_GET_ASSIGNED_CATEGORIES:
      return {
        ...state,
        assignedCategories: action.payload,
      };
    case CHIEF_GET_REJECTED_QUESTIONS:
      return {
        ...state,
        rejectedQuestions: action.payload,
      };
    case CHIEF_GET_ACTIVE_CATEGORIES:
      return {
        ...state,
        activeCategories: action.payload,
      };
    case CHIEF_GET_STOPPED_CATEGORIES:
      return {
        ...state,
        stoppedCategories: action.payload,
      };
    case CHIEF_CHANGE_ASSIGNED_CATEGORIES:
      return {
        ...state,
        assignedCategories: {
          ...state.assignedCategories,
          [action.payload.user]: action.payload.value.map(x => x.id),
        },
      };
    case CHIEF_ACCEPT_QUESTION:
    case CHIEF_REJECT_QUESTION:
      return {
        ...state,
        pendingQuestions: state.pendingQuestions.filter(question => question.id !== action.payload.id),
        activeQuestions: action.type === CHIEF_ACCEPT_QUESTION ? (
          [action.payload, ...state.activeQuestions]
        ) : (
          [...state.activeQuestions]
        ),
      };
    case CHIEF_DELETE_QUESTION:
      return {
        ...state,
        pendingQuestions: state.pendingQuestions.filter(question => question.id !== action.payload.id),
        stoppedQuestions: state.stoppedQuestions.filter(question => question.id !== action.payload.id),
        rejectedQuestions: state.rejectedQuestions.filter(question => question.id !== action.payload.id),
      };
    case CHIEF_STOP_QUESTION:
      return {
        ...state,
        activeQuestions: state.activeQuestions.filter(question => question.id !== action.payload.id),
        stoppedQuestions: [action.payload, ...state.stoppedQuestions],
      };
    case CHIEF_RESUME_QUESTION:
      return {
        ...state,
        activeQuestions: [action.payload, ...state.activeQuestions],
        stoppedQuestions: state.stoppedQuestions.filter(question => question.id !== action.payload.id),
      };
    case CHIEF_DELETE_CATEGORY:
      return {
        ...state,
        activeCategories: state.activeCategories.filter(question => question.id !== action.payload.id),
        stoppedCategories: state.stoppedCategories.filter(question => question.id !== action.payload.id),
      };
    case CHIEF_STOP_CATEGORY:
      return {
        ...state,
        activeCategories: state.activeCategories.filter(question => question.id !== action.payload.id),
        stoppedCategories: [action.payload, ...state.stoppedCategories],
      };
    case CHIEF_RESUME_CATEGORY:
      return {
        ...state,
        activeCategories: [action.payload, ...state.activeCategories],
        stoppedCategories: state.stoppedCategories.filter(question => question.id !== action.payload.id),
      };
    case COMMON_CREATE_CATEGORY:
      return {
        ...state,
        activeCategories: [action.payload, ...state.activeCategories],
      };
    default:
      return state;
  }
}
