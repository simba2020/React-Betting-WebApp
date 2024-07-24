const Env = (() => {
  return {
    API_URL: process.env.REACT_APP_API_URL,
    ASSETS_URL: process.env.REACT_APP_ASSETS_URL,
    PUBNUB_PUBLISHKEY: process.env.REACT_APP_PUBNUB_PUBLISHKEY,
    PUBNUB_SUBSCRIBEKEY: process.env.REACT_APP_PUBNUB_SUBCRIBEKEY,
    PUBLISHER_URL: process.env.REACT_APP_PUBLISHER_URL,
    URL: process.env.REACT_APP_URL,
    COUPONS_SPORTS: process.env.REACT_APP_COUPONS_SPORTS,
    COUPONS_TOURNAMENTS: process.env.REACT_APP_COUPONS_TOURNAMENTS,
    TOAST_TIMEOUT: parseInt(process.env.REACT_APP_TOAST_TIMEOUT),
    ENV_TITLE: process.env.REACT_APP_ENV_TITLE,
    GA_ID: process.env.REACT_APP_GA_ID,
  };
})();

export default Env;
