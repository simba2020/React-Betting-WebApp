import ApiService from 'services/ApiService';

const ClientProfileService = (() => {
  const forgotPassword = (data = { email: null }) => {
    return ApiService.getInstance()
      .post('/venus/user/forgot-password', data, { _skipToken: true, _noRetry: true })
      .then((res) => res.data);
  };

  const casinoCategories = async () => {
    return await ApiService.getInstance()
      .get('/venus/casino/categories')
      .then((res) => res.data);
  };

  const promotedCasinoGames = async () => {
    return await ApiService.getInstance()
      .get('/venus/casino/games/promoted-sub')
      .then((res) => res.data);
  };

  const casinoGames = async (query) => {
    return await ApiService.getInstance()
      .get(`/venus/casino/games/list${query}`)
      .then((res) => res.data);
  };

  const casinoGameUrl = async (id, mode) => {
    return await ApiService.getInstance()
      .get(`/venus/casino/game/${id}/${mode}`)
      .then((res) => res.data);
  };

  const casinoDemoUrl = async (id, mode) => {
    return await ApiService.getInstance()
      .get(`/venus/casino/demo/${id}/${mode}`)
      .then((res) => res.data);
  };

  return {
    forgotPassword,
    casinoCategories,
    promotedCasinoGames,
    casinoGames,
    casinoGameUrl,
    casinoDemoUrl,
  };
})();

export default ClientProfileService;
