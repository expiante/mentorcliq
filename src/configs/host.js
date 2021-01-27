import packageJson from '../../package.json';

const generic = {
  production: {},
  development: {
    URL_PROTOCOL: 'https',
    WS_PROTOCOL: 'wss',
    API_DOMAIN: '600db9e13bb1d100179de357.mockapi.io/api/v1/',
  },
  localhost: {},
};

const getENV = () => {
  return process.env.REACT_APP_API_URL_ENV || process.env.NODE_ENV || 'development';
};

const source = generic[getENV()] || generic.development;

export const HOST = {
  API: {
    VERSION: packageJson.version,
    URL: `${source.URL_PROTOCOL}://${source.API_DOMAIN}/`,
    WS: `${source.WS_PROTOCOL}://${source.API_DOMAIN}/`,
    PROTOCOL: `${source.URL_PROTOCOL}://`,
    API_PREFIX: '',
    AUTH_HEADER: 'Authorization',
    AUTH_PREFIX: 'Bearer',
  },
};
