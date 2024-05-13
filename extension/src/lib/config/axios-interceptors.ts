import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import TokenService from "@/services/token.service";

import axios from "./axios-instance";

const PUBLIC_ENDPOINTS=[""];

// intercepting requests
// Step-2: Create request, response & error handlers
const requestHandler = async (request: InternalAxiosRequestConfig) => {
  // Token will be dynamic, so we can use any app-specific way to always
  // fetch the new token before making the call
  const token =  await TokenService.getLocalAccessToken();
  const refreshToken = await TokenService.getLocalRefreshToken();
  if (token && request.url !== `/auth/tokens`) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers["Authorization"] = `Bearer ${refreshToken}`;
  }
  return request;
};

const responseHandler = async (response: AxiosResponse) => {
  response.headers[
    "Authorization"
  ] = `Bearer ${await TokenService.getLocalAccessToken()}`;
  return response;
};

const errorHandler = async (err: any) => {
  const originalConfig = err.config;
  const retries = await TokenService.getTokenRetries();
  console.log(originalConfig,'original-config')
  console.log(err.response,'res-err')
  console.log(retries,'retries')
  if (
    !PUBLIC_ENDPOINTS.includes(
      originalConfig.url.split("?")[0]
        ? originalConfig.url.split("?")[0]
        : originalConfig.url
    ) &&
    err.response
  ) {
    if (retries > 0 && retries) {
      if (err.response.status === 401) {
        if (originalConfig.url === `/auth/tokens`) {
          await TokenService.setTokenRetries(retries - 1);
        }
        originalConfig._retry = true;
        try {
          const rs = await axios.get(`/auth/tokens`);

          const { access_token, refresh_token } = rs.data.data.tokens;
          console.log('new-token-pair',rs.data.data.tokens);
          await TokenService.saveLocalRefreshToken(refresh_token);
          await TokenService.saveLocalAccessToken(access_token);
          await TokenService.setTokenRetries(5);
          return axios(originalConfig);
        } catch (error) {
          console.log('refresh-err',error)
          return Promise.reject(error);
        }
      } else if (err.response.status === 403) {
        // createNewTabUrl('http://localhost:5173/login');
      }
    } else {
      TokenService.clearStorage();
    }
  }
  return Promise.reject(err);
};

const setup = () => {
  axios.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => requestHandler(request),
    (error: any) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => responseHandler(response),
    (error: any) => errorHandler(error)
  );
};

export default setup;
