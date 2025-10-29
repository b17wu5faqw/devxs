"use client";

import axios, { AxiosRequestConfig } from "axios";

import { HOST_API } from "../global-config";
import { useRouter } from "next/navigation";
import { getGameReport } from "@/apis/lotto";
import { repeat } from "lodash";

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const router = useRouter();
        router.push("/login");
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const endpoints = {
  auth: {
    login: `users/login`,
    register: `users/register`,
  },

  user: {
    get: `users/users`,
    create: `users/create`,
    update: `users/update`,
    profile: `users/profile`,
  },

  menu: {
    hotMenu: `menu/hot-menu`,
    vnLotto: "menu/vn-lotto",
    loKu: "menu/lo-ku",
  },

  result: {
    scheduler: `result/scheduler`,
    getResult: "result/get-result",
  },

  lotto: {
    currentDraw: "lotto/current-draw",
    getDraw: "lotto/get-draw",
    listDraw: "lotto/list-draw",
    lastDraw: "lotto/last-draw",
    getType: "bet-rule/grouped-list",
    getBetRule: "bet-rule/get-bet-rule",
    sellLotto: "lotto/sell",
    history: "lotto/history",
    repeat: "lotto/repeat",
    getMainBalance: 'account/get-main-balance',
    makeTransfer: 'account/make-transfer',
    getReport: 'report/index',
    getDailyReport: 'report/history',
    getRealTimeReport: 'report/real-time',
    getGameReport: 'report/daily-report',
  },
  sicbo: {
    currentDraw: "sicbo/current-draw",
    listLastDraw: "sicbo/list-last-draw",
    betTypes: "sicbo/bet-types",
    sell: "sicbo/sell",
    statisticResult: "sicbo/statistic-result",
    lastDraw: "sicbo/last-draw",
  },
  rps: {
    currentDraw: "rps/current-draw",
    listLastDraw: "rps/list-last-draw",
    betTypes: "rps/bet-types",
    sell: "rps/sell",
    lastDraw: "rps/last-draw",
    statisticResult: "rps/statistic-result",
    statisticDoubleBet: "rps/statistic-double-bet",
  },
  kuLive:{
    getBetTypeList: 'ku-live/bet-rule-lists',
    getBetRule: 'ku-live/bet-rule',
    sellKuLiveA: 'ku-live/sell-a',
    sellKuLiveB: 'ku-live/sell-b',
    getResult: 'ku-live/result',
  },
  kuLotto:{
    getBetTypeList: 'ku-lotto/bet-rule-lists',
    getBetRule: 'ku-lotto/bet-rule',
    sellLottoA: 'ku-lotto/sell-a',
    sellLottoC: 'ku-lotto/sell-c',
    getResult: 'ku-lotto/result',
  }
};
