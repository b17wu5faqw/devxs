import axiosInstance, { endpoints } from "@/utils/axios";

export const getAllScheduler = async (): Promise<any> => {
  const response = await axiosInstance.get(`${endpoints.result.scheduler}`);
  return response.data;
};

export const getResultScheduler = async (params?: { scheduler_id: number, lotto_type: number }) => {
  const resp = await axiosInstance.get(endpoints.result.getResult, {
    params,
  });
  return resp.data;
};