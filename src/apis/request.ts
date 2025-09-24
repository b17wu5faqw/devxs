import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import _ from "lodash";
import { authConfig } from "./auth";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("error", error);
  }
);

export const setAuth = (authToken: string | undefined) => {
  if (authToken) {
    axios.defaults.headers["Authorization"] = `Bearer ${authToken}`;
    localStorage.setItem("access_token", authToken);
  } else {
    delete axios.defaults.headers["Authorization"];
    localStorage.removeItem("access_token");
  }
};

const handleError = (error: any): any => {
  const resp: any = error.response;

  if (resp == null || resp.data == null) {
    return { data: { ResponseCode: -99, Message: "Internal Server Error!" } };
  }

  return resp;
};

export const get = async (url: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await axios.get(getAccessToken(url), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const post = async (
  url: string,
  body: Record<any, any>,
  cancelTokenSource?: CancelTokenSource
): Promise<any> => {
  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      // "Access-Control-Allow-Headers":
      //   "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length",
    },
  };

  if (cancelTokenSource) {
    config.cancelToken = cancelTokenSource.token;
  }

  const data = JSON.stringify(body);

  try {
    const response = await axios.post(getAccessToken(url), data, config);
    // logInfo(`POST ${url}`, response.data);
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const put = async (
  url: string,
  body: Record<any, any>,
  cancelTokenSource?: CancelTokenSource
): Promise<any> => {
  const config: AxiosRequestConfig = {};
  if (cancelTokenSource) {
    config.cancelToken = cancelTokenSource.token;
  }
  const data = JSON.stringify(body);

  try {
    const response = await axios.put(getAccessToken(url), data, config);
    // logInfo(`PUT ${url}`, response.data);
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const del = async (
  url: string,
  body: Record<any, any>,
  cancelTokenSource?: CancelTokenSource
): Promise<any> => {
  const config: AxiosRequestConfig = {};
  if (cancelTokenSource) {
    config.cancelToken = cancelTokenSource.token;
  }
  const data = JSON.stringify(body);

  try {
    const response = await axios.delete(getAccessToken(url), { data });
    // logInfo(`DELETE ${url}`, response.data);
    return response;
  } catch (error) {
    return handleError(error);
  }
};

export const postForm = async (
  url: string,
  body: Record<any, any>,
  cancelTokenSource?: CancelTokenSource
): Promise<any> => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  if (cancelTokenSource) {
    config.cancelToken = cancelTokenSource.token;
  }
  const form = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (_.isArray(value)) {
      value.map((item) => {
        form.append(key, item);
      });
    } else {
      form.append(key, value);
    }
  });
  try {
    const response = await axios.post(getAccessToken(url), form, config);
    // logInfo(`POST FORM ${url}`, response.data);
    return response;
  } catch (error) {
    return handleError(error);
  }
};

const getAccessToken = (url: string) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken && accessToken?.length) {
    url += (url.indexOf("?") == -1 ? "?" : "&") + `access_token=${accessToken}`;
  }

  return url;
};
