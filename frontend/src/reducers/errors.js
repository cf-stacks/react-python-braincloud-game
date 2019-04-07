import {
  GET_ERRORS,
  LOGOUT_SUCCESS,
} from '../actions/types';

const initialState = {
  msg: {},
  status: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
      };
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
