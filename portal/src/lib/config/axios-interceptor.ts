
// eslint-disable-next-line import/named
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { PUBLIC_ENDPOINTS } from "@/lib/constants";
import TokenService from "@/services/token.service";
import axios from "./axios-instance";

// intercepting requests
// Step-2: Create request, response & error handlers
const requestHandler = (request: InternalAxiosRequestConfig) => {
    // Token will be dynamic, so we can use any app-specific way to always
    // fetch the new token before making the call
    const token = TokenService.getLocalAccessToken();
    if (token) {
        request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
};

const responseHandler = (response: AxiosResponse) => {
    response.headers["Authorization"] =
        `Bearer ${TokenService.getLocalAccessToken()}`;
    return response;
};

const errorHandler = async (err: any) => {
    const originalConfig = err.config;

    if (
        !PUBLIC_ENDPOINTS.includes(
            originalConfig.url.split("?")[0]
                ? originalConfig.url.split("?")[0]
                : originalConfig.url,
        ) &&
        err.response
    ) {
        // if (err.response.status === 401 || err.response.status === 403) {
        //   window.location.href = "/login";
        // }
    }
    return Promise.reject(err);
};

const setup = () => {
    axios.interceptors.request.use(
        (request: InternalAxiosRequestConfig) => requestHandler(request),
        (error: any) => Promise.reject(error),
    );

    axios.interceptors.response.use(
        (response: AxiosResponse) => responseHandler(response),
        (error: any) => errorHandler(error),
    );
};

export default setup;
