import {refreshToken} from "./actions/auth";
import store from "./store";
import axios from "axios";

const createSetAuthInterceptor = store => config => {
  if (store.getState().auth.authToken) config.headers.Authorization = `CustomJWT ${store.getState().auth.authToken}`;
  else delete config.headers.Authorization;
  return config;
};

let refreshTokenPromise;

const createUpdateAuthInterceptor = (store, http) => async error => {
  const token = store.getState().auth.refreshToken;
  const data =  error.response.data;
  if (!(
      token &&
      data.code === "token_not_valid" &&
      data.messages &&
      data.messages[0].token_class === "AccessToken"
  )) {
    return Promise.reject(error);
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = store.dispatch(refreshToken(token));
  }

  await refreshTokenPromise;
  refreshTokenPromise = null;
  return http(error.config);
};

const setAuthCb = createSetAuthInterceptor(store);
const updateAuthCb = createUpdateAuthInterceptor(store, axios);

axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers.common['Accept-Language'] = "ru,en";
axios.interceptors.request.use(setAuthCb);
axios.interceptors.response.use(null, updateAuthCb);
