import Env from "./Env";

const getAssetUrl = (path = '') => {
  return path.startsWith('/')
    ? `${Env.ASSETS_URL}${path}`
    : `${Env.ASSETS_URL}/${path}`;
}

export {
  getAssetUrl
};

