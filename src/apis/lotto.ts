import axiosInstance, { endpoints } from "@/utils/axios";
import { get, post } from "./request";
import { HOST_API } from "../global-config";

export const getCurrentDraw = async (params?: {
  schedule_id: number;
  lotto_type: number;
}) => {
  const response = await axiosInstance.get(`${endpoints.lotto.currentDraw}`, {
    params,
  });
  return response.data;
};

export const getDraw = async (params?: { draw_id: number }) => {
  const response = await axiosInstance.get(`${endpoints.lotto.getDraw}`, {
    params,
  });
  return response.data;
};

export const getLastDraw = async (params?: {
  draw_id: number;
  lotto_type: number;
  scheduler_id: number;
}) => {
  const response = await axiosInstance.get(endpoints.lotto.lastDraw, {
    params,
  });
  return response.data;
};

export const getListDraw = async (params?: {
  schedule_id: number;
  lotto_type: number;
}) => {
  const response = await axiosInstance.get(`${endpoints.lotto.listDraw}`, {
    params,
  });
  return response.data;
};

export const getType = async () => {
  const response = await axiosInstance.get(endpoints.lotto.getType);
  return response.data;
};

export const getTypeV2 = async (params?: { regionId: number, schedulerId: number, type: number }) => {
  const resp = await axiosInstance.get(endpoints.lotto.getType, { params });
  return resp.data;
};

export const getBetRule = async (params?: { betTypeId: number }) => {
  const resp = await axiosInstance.get(endpoints.lotto.getBetRule, { params });
  return resp.data;
};

export const getReport = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.lotto.getReport, { params });
  return resp.data;
};

export const getDailyReport = async (params?: { jwt_key: string, paymentDate: string, schedule: string }) => {
  const resp = await axiosInstance.get(endpoints.lotto.getDailyReport, { params });
  return resp.data;
};

export const getRealTimeReport = async (params?: { jwt_key: string, pageIndex:number, pageSize:number }) => {
  const resp = await axiosInstance.get(endpoints.lotto.getRealTimeReport, { params });
  return resp.data;
};

export const getGameReport = async (params?: { jwt_key: string, date: string }) => {
  const resp = await axiosInstance.get(endpoints.lotto.getGameReport, { params });
  return resp.data;
};

export const sellLotto = async (data: {
  digits: string;
  bet_point: number;
  amount: number;
  total_amount: number;
  drawId: number;
  betTypeId: number;
  jwt_key: string;
  region_id: number;
  lotto_type: number;
}) => {
  const resp = await axiosInstance.post(endpoints.lotto.sellLotto, data);
  return resp.data;
};

export const sellLotto2 = async (body: { digits: string; amount: number }) => {
  const resp = await post(HOST_API + "/" + endpoints.lotto.sellLotto, body);
  return resp;
};

export const history = async (data: { jwt_key: string, pageIndex:number, pageSize:number }) => {
  const resp = await axiosInstance.post(endpoints.lotto.history, data);
  return resp.data;
};

export const repeat = async (data: { jwt_key: string, schedulerId: number }) => {
  const resp = await axiosInstance.post(endpoints.lotto.repeat, data);
  return resp.data;
};