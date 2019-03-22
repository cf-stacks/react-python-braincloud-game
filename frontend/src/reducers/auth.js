import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS, TOKEN_REFRESHED,
} from "../actions/types"

const initialState = {
  authToken: localStorage.getItem("authToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isLoading: false,
  user: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
    case TOKEN_REFRESHED:
      localStorage.setItem("authToken" , action.payload.authToken);
      localStorage.setItem("refreshToken" , action.payload.refreshToken);
      return {
        ...state,
        ...action.payload,
      };
    case AUTH_ERROR:
    case LOGIN_FAILURE:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      return {
        ...state,
        authToken: null,
        refreshToken: null,
        user: null,
        isLoading: false,
      };
    default:
      return state;
  }
}
