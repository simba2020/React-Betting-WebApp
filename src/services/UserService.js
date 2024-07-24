import ApiService from 'services/ApiService';

const UserService = (() => {
  const login = (data = { username: '', password: '' }, params = {}) => {
    return ApiService.getInstance().post('/venus/auth/login', data, params);
  };

  const register = (data) => {
    return ApiService.getInstance().post('/venus/user?flatten=1', data, { _skipToken: true });
  };

  const activate = (token) => {
    return ApiService.getInstance().post('/venus/user/activate', { token }, { _skipToken: true });
  };

  const forgotPassword = (email) => {
    return ApiService.getInstance().post('/venus/user/forgot-password', { email }, { _skipToken: true });
  };

  const resetPassword = (data) => {
    return ApiService.getInstance().put('/venus/user/forgot-password?flatten=1', data, { _skipToken: true });
  };

  const refreshToken = (data = { refresh_token: '' }, params = {}) => {
    return ApiService.getInstance().post('/venus/auth/refresh', data, params);
  };

  const heartbeat = (params = {}) => {
    return ApiService.getInstance().head('/venus/user/session', params);
  };

  return { login, register, activate, forgotPassword, resetPassword, refreshToken, heartbeat };
})();

export default UserService;
