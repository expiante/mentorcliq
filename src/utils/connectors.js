// Load vendors
import axios from 'axios';
// import i18n from 'i18next';

// Load configs
import { HOST } from 'configs/host';

// Load store
import store from 'redux/store';

// Load actions
import { setFetching } from 'redux/app/thunk';

// Set config defaults when creating the instance
export const Api = axios.create({
  baseURL: `${HOST.API.URL}/${HOST.API.API_PREFIX}`,
  // THIS HEADERS IS IMPORTANT SEE THE URL ABOVE
  headers: { common: {} },
});

export const setRequestHeaderToken = (token, api) => {
  api.defaults.headers.common[HOST.API.AUTH_HEADER] = `${HOST.API.AUTH_PREFIX} ${token}`;
};

export const setRequestHeader = (api, key, value) => {
  api.defaults.headers.common[key] = value;
};


// Request interceptor
Api.interceptors.request.use(handleRequestInterceptor, handleRequestFailInterceptor);

// Response interceptor
Api.interceptors.response.use(handleResponseInterceptor, handleRequestFailInterceptor);

function handleRequestInterceptor(request) {
  const { dispatch } = store;
  if (!request.hideGlobalLoading) dispatch(setFetching(true));
  return request;
}

function handleResponseInterceptor(response) {
  const { dispatch } = store;
  dispatch(setFetching(false));
  return response;
}

function handleRequestFailInterceptor(error) {
  const { dispatch } = store;
  dispatch(setFetching(false));

  return Promise.reject(error);
}
