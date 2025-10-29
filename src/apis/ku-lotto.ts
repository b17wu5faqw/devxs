import axiosInstance, { endpoints } from "@/utils/axios";

export const getBetTypeList = async () => {
  const response = await axiosInstance.get(endpoints.kuLotto.getBetTypeList);
  return response.data;
};

export const getBetType = async (params?: { betTypeId: number }) => {
  const response = await axiosInstance.get(endpoints.kuLotto.getBetRule, { params });
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

export const sellLottoA = async (data: {
  digits: string;
  amount: number;
  drawId: number;
  betTypeId: number;
  betPoint: number;
  drawCount: number;
  jwt_key: string;
}) => {
  const resp = await axiosInstance.post(endpoints.kuLotto.sellLottoA, data);
  return resp.data;
};

export const sellLottoC = async (data: {
  digits: string;
  amount: number;
  drawId: number;
  betTypeId: number;
  betPoint: number;
  drawCount: number;
  jwt_key: string;
}) => {
  const resp = await axiosInstance.post(endpoints.kuLotto.sellLottoC, data);
  return resp.data;
};

export const getResult = async (params?: { gType: number}) => {
  const response = await axiosInstance.get(endpoints.kuLotto.getResult, { params });
  return response.data;
};