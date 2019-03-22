import {
  EDITOR_GET_QUESTIONS,
} from "../actions/types.js"

const initialState = {
  questions: [],
};

export default function (state=initialState, action) {
  switch (action.type) {
    case EDITOR_GET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };
    default:
      return state;
  }
}