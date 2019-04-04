import {
  CREATE_MESSAGE,
  LOGOUT_SUCCESS,
} from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_MESSAGE:
      return {
        ...state,
        ...action.payload,
      };
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
