import axios from 'axios';

import Env from 'utils/Env';
import store from 'redux/configureStore';
import { selectUserInfo } from 'redux/selectors/user';
import { logout, refreshToken } from 'redux/reducers/user';
import { StatusCodes } from 'http-status-codes';

const ApiService = (() => {
  const instance = axios.create({
    withCredentials: true,
    baseURL: Env.API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (config._skipToken) {
        return config;
      }

      const { accessToken } = selectUserInfo(store.getState());

      if (accessToken) {
        config.headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }

      return config;
    },
    (error) => Promise.reject(error),
    { synchronous: true }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest._skipToken) {
        return Promise.reject(error.response);
      }

      const status = error.response.status;

      if (status !== StatusCodes.UNAUTHORIZED || (status === StatusCodes.UNAUTHORIZED && originalRequest._retry)) {
        return Promise.reject(error);
      }

      const { refreshToken: refresh_token } = selectUserInfo(store.getState());

      if (!refresh_token) {
        return Promise.reject(error);
      }

      const response = await store.dispatch(refreshToken({ refresh_token })).catch(() => ({ error: true }));

      if (response.error) {
        store.dispatch(logout());

        return Promise.reject(error);
      }

      if (originalRequest._noRetry) {
        return Promise.resolve();
      }

      originalRequest._retry = true;

      return instance(originalRequest);
    }
  );

  const getInstance = () => instance;

  const getCancelTokenSource = () => axios.CancelToken.source();

  return { getInstance, getCancelTokenSource };
})();

export default ApiService;
