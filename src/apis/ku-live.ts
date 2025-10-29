import axiosInstance, { endpoints } from "@/utils/axios";

export const getBetTypeList = async () => {
  const response = await axiosInstance.get(endpoints.kuLive.getBetTypeList);
  return response.data;
};

export const getBetType = async (params?: { betTypeId: number }) => {
  const response = await axiosInstance.get(endpoints.kuLive.getBetRule, { params });
  return response.data;
};

export const sellKuLiveA = async (data: {
  digits: string;
  amount: number;
  drawId: number;
  betTypeId: number;
  betPoint: number;
  jwt_key: string;
}) => {
  const resp = await axiosInstance.post(endpoints.kuLive.sellKuLiveA, data);
  return resp.data;
};

export const sellKuLiveB = async (data: {
  digits: string;
  amount: number;
  drawId: number;
  betTypeId: number;
  betPoint: number;
  jwt_key: string;
}) => {
  const resp = await axiosInstance.post(endpoints.kuLive.sellKuLiveB, data);
  return resp.data;
};

export const getResult = async (params?: { gType: number}) => {
  const response = await axiosInstance.get(endpoints.kuLive.getResult, { params });
  return response.data;
};
