import axiosInstance, { endpoints } from "@/utils/axios";
import { get, postForm } from "./request";
import { getUrl } from "./auth";


export const getCurrentDraw = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.sicbo?.currentDraw || "sicbo/current-draw", { params });
  return resp.data;
};

export const getCurrentDrawV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/current-draw");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getListLastDraw = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.sicbo?.listLastDraw || "sicbo/list-last-draw", { params });
  return resp.data;
};

export const getListLastDrawV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/list-last-draw");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getBetTypes = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.sicbo?.betTypes || "sicbo/bet-types", { params });
  return resp.data;
};

export const getBetTypesV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/bet-types");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

// New API functions
export const sellBet = async (params: {
  codes: string;
  amount: string;
  drawId: string;
  betTypeId: string;
  jwt_key: string;
  betPoint: string;
}) => {
  const resp = await axiosInstance.post("sicbo/sell", null, { 
    params: {
      codes: params.codes,
      amount: params.amount,
      drawId: params.drawId,
      betTypeId: params.betTypeId,
      jwt_key: params.jwt_key,
      betPoint: params.betPoint
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
  return resp.data;
};

export const sellBetV2 = async (params: {
  codes: string;
  amount: string;
  drawId: string;
  betTypeId: string;
  jwt_key: string;
  betPoint: string;
}): Promise<any> => {
  const url = getUrl("sicbo/sell");
  const resp = await postForm(url, params);
  return resp.data;
};

export const getStatisticResult = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get("sicbo/statistic-result", { params });
  return resp.data;
};

export const getStatisticResultV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/statistic-result");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getStatisticLast30Result = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get("sicbo/statistic-result", { params });
  return resp.data;
};

export const getStatisticLast30ResultV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/statistic-result");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
}; 