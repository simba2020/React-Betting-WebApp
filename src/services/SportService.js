import ApiService from 'services/ApiService';

const SportService = (() => {
  const getAllSports = () => {
    return ApiService.getInstance()
      .get('/venus/sports?resolve=1')
      .then((res) => res.data);
  };

  const getSport = (sport) => {
    return ApiService.getInstance()
      .get(`/venus/tournaments/${sport}?resolve=1&featured=1`)
      .then((res) => res.data)
      .catch((err) => err.response);
  };

  const getHomepage = () => {
    return ApiService.getInstance()
      .get('/venus/homepage')
      .then((res) => res.data)
      .catch((err) => err.response);
  };

  const getEvents = (id) => {
    return ApiService.getInstance()
      .get(`/venus${id}`)
      .then((res) => res.data);
  };

  const getEvent = (id) => {
    return ApiService.getInstance()
      .get(`/venus/event/${id}`)
      .then((res) => res.data)
      .catch((err) => err.response);
  };

  const getFooterContents = () => {
    return ApiService.getInstance()
      .get('/venus/content/footer')
      .then((res) => res.data)
      .catch((err) => err.response);
  };

  const getPromotionContents = () => {
    return ApiService.getInstance()
      .get('/venus/content/promotion-bar')
      .then((res) => res.data)
      .catch((err) => err.response);
  };

  const getStaticContent = (slug) => {
    return ApiService.getInstance()
      .get(`/venus/content/page/${slug}`)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response;
      });
  };

  const search = async (param, { cancelToken } = {}) => {
    return await ApiService.getInstance()
      .get(`/venus/search/${param}`, { cancelToken })
      .then((res) => res.data);
  };

  const getCasinoCategory = async () => {
    return await ApiService.getInstance()
      .get('/venus/casino/categories')
      .then((res) => res.data);
  };

  const addEventFavourite = async (id) => {
    return await ApiService.getInstance()
      .put(`/venus/user/favorites/event/${id}`)
      .then((res) => res.data);
  };

  const checkFavouriteEvent = async (id) => {
    return await ApiService.getInstance()
      .get(`/venus/user/favorites/event/${id}`)
      .then((res) => res.data);
  };

  const delFavouriteEvent = async (id) => {
    return await ApiService.getInstance()
      .delete(`/venus/user/favorites/event/${id}`)
      .then((res) => res.data);
  };

  const addFavouriteOpponent = async (id) => {
    return await ApiService.getInstance()
      .put(`/venus/user/favorites/opponent/${id}`)
      .then((res) => res.data);
  };

  const checkFavouriteOpponent = async (id) => {
    return await ApiService.getInstance()
      .get(`/venus/user/favorites/opponent/${id}`)
      .then((res) => res.data);
  };

  const delFavouriteOpponent = async (id) => {
    return await ApiService.getInstance()
      .delete(`/venus/user/favorites/opponent/${id}`)
      .then((res) => res.data);
  };

  const getFavourite = async () => {
    return await ApiService.getInstance()
      .get('/venus/user/favorites/active')
      .then((res) => res.data);
  };

  const getHorseQuickLinks = async () => {
    return await ApiService.getInstance()
      .get('/venus/next/list/horseracing')
      .then((res) => res.data);
  };

  const fetchHorseRacingUpcomingEvents = async () => {
    return await ApiService.getInstance()
      .get('/venus/next/events/horseracing')
      .then((res) => res.data);
  };

  const getHorseNextEvents = async () => {
    return await ApiService.getInstance()
      .get('/venus/next/events/horseracing')
      .then((res) => res.data);
  };

  const getHorseEventGroup = async () => {
    return await ApiService.getInstance()
      .get('/venus/next/events-groups/horseracing')
      .then((res) => res.data);
  };

  const verifySession = async () => {
    return await ApiService.getInstance()
      .get('/venus/user/session')
      .then((res) => res.data);
  };

  const getPromotion = async () => {
    return await ApiService.getInstance()
      .get('/venus/content/promotion-bar')
      .then((res) => res.data);
  };

  const getLiveNav = async () => {
    return await ApiService.getInstance()
      .get('/venus/live/list')
      .then((res) => res.data);
  };

  const getLiveEvents = async (param) => {
    return await ApiService.getInstance()
      .get(`/venus/live/${param}`)
      .then((res) => res.data);
  };

  const getTournament = async (param) => {
    return await ApiService.getInstance()
      .get(`/venus/events/${param}`)
      .then((res) => res.data);
  };

  const getFeaturedEvents = async (param) => {
    return await ApiService.getInstance()
      .get(`/venus/events/featured/${param}`)
      .then((res) => res.data);
  };

  return {
    getAllSports,
    getSport,
    getHomepage,
    getEvents,
    getEvent,
    getFooterContents,
    getPromotionContents,
    getStaticContent,
    search,
    getCasinoCategory,
    addEventFavourite,
    checkFavouriteEvent,
    delFavouriteEvent,
    addFavouriteOpponent,
    checkFavouriteOpponent,
    delFavouriteOpponent,
    getFavourite,
    getHorseQuickLinks,
    getHorseNextEvents,
    getHorseEventGroup,
    verifySession,
    getPromotion,
    getLiveNav,
    getLiveEvents,
    getTournament,
    getFeaturedEvents,
    fetchHorseRacingUpcomingEvents,
  };
})();

export default SportService;
