import axiosInstance, { endpoints } from "@/utils/axios";
import { get } from "./request";
import { getUrl } from "./auth";

export const getHotMenu1 = async (): Promise<any> => {
  const response = await axiosInstance.get(`${endpoints.menu.hotMenu}`);
  return response.data;
};

export const getHotMenu = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.menu.hotMenu, { params });
  return resp.data;
};

export const getHotMenuV2 = async (): Promise<any> => {
  const resp = await get(getUrl(endpoints.menu.hotMenu));
  return resp.data;
};

export const getVnLotto = async (): Promise<any> => {
  const response = await axiosInstance.get(`${endpoints.menu.vnLotto}`);
  return response.data;
};

export const getLoKu = async (): Promise<any> => {
  const response = await axiosInstance.get(`${endpoints.menu.loKu}`);
  return response.data;
};