import axiosInstance, { endpoints } from "@/utils/axios";
import { getUrl } from "./auth";
import { get, post } from "./request";


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
  const formData = new FormData();
  formData.append('codes', params.codes);
  formData.append('amount', params.amount);
  formData.append('drawId', params.drawId);
  formData.append('betTypeId', params.betTypeId);
  formData.append('jwt_key', params.jwt_key);
  formData.append('betPoint', params.betPoint);

  const resp = await axiosInstance.post("sicbo/sell", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
  const resp = await post(url, params);
  return resp.data;
};

export const getStatisticGeneral = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get("sicbo/statistic-general", { params });
  return resp.data;
};

export const getStatisticGeneralV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/statistic-general");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
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

export const getStatisticDoubleBet = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get("sicbo/statistic-double-bet", { params });
  return resp.data;
};

export const getStatisticDoubleBetV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/statistic-double-bet");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getLastDraw = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.sicbo?.lastDraw || "sicbo/last-draw", { params });
  return resp.data;
};

export const getLastDrawV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("sicbo/last-draw");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
}; 