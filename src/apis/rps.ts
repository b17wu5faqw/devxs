import axiosInstance, { endpoints } from "@/utils/axios";
import { getUrl } from "./auth";
import { get, post } from "./request";

export const getCurrentDraw = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.rps?.currentDraw || "rps/current-draw", { params });
  return resp.data;
};

export const getCurrentDrawV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("rps/current-draw");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getListLastDraw = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.rps?.listLastDraw || "rps/list-last-draw", { params });
  return resp.data;
};

export const getListLastDrawV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("rps/list-last-draw");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getBetTypes = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.rps?.betTypes || "rps/bet-types", { params });
  return resp.data;
};

export const getBetTypesV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("rps/bet-types");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

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

  const resp = await axiosInstance.post("rps/sell", formData, {
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
  const url = getUrl("rps/sell");
  const resp = await post(url, params);
  return resp.data;
};

export const getLastDraw = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.rps?.lastDraw || "rps/last-draw", { params });
  return resp.data;
};

export const getLastDrawV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("rps/last-draw");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getStatisticResult = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get("rps/statistic-result", { params });
  return resp.data;
};

export const getStatisticResultV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("rps/statistic-result");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};

export const getStatisticDoubleBet = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get("rps/statistic-double-bet", { params });
  return resp.data;
};

export const getStatisticDoubleBetV2 = async (params?: { jwt_key: string }): Promise<any> => {
  const url = getUrl("rps/statistic-double-bet");
  const queryParams = params?.jwt_key ? `?jwt_key=${params.jwt_key}` : "";
  const resp = await get(`${url}${queryParams}`);
  return resp.data;
};