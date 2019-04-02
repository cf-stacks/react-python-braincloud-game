import axios from 'axios';

import globalStore from './store';
import { doRefreshToken } from './actions/auth';

const createSetAuthInterceptor = currentStore => (axiosConfig) => {
  const config = axiosConfig;
  if (currentStore.getState().auth.authToken) {
    config.headers.Authorization = `CustomJWT ${currentStore.getState().auth.authToken}`;
  } else delete config.headers.Authorization;
  return config;
};

let refreshTokenPromise;

const createUpdateAuthInterceptor = (store, http) => async (error) => {
  const token = store.getState().auth.refreshToken;
  const { data } = error.response;
  if (!(
    token
    && data.code === 'token_not_valid'
    && data.messages
    && data.messages[0].token_class === 'AccessToken'
  )) {
    return Promise.reject(error);
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = store.dispatch(doRefreshToken(token));
  }

  await refreshTokenPromise;
  refreshTokenPromise = null;
  return http(error.config);
};

const setAuthCb = createSetAuthInterceptor(globalStore);
const updateAuthCb = createUpdateAuthInterceptor(globalStore, axios);

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000';
axios.defaults.headers.common['Accept-Language'] = 'ru,en';
axios.interceptors.request.use(setAuthCb);
axios.interceptors.response.use(null, updateAuthCb);
