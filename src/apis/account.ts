import axiosInstance, { endpoints } from "@/utils/axios";
import { get, post } from "./request";

export const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export const subDomains = {
  PORTAL: process.env.NEXT_PUBLIC_PORTAL,
  CASINO: process.env.NEXT_PUBLIC_CASINO,
};

export const getUrl = (url: string): string => {
  return `${DOMAIN_NAME}${url}`;
};

export const getMainBalance = async (params?: { jwt_key: string }) => {
  const resp = await axiosInstance.get(endpoints.lotto.getMainBalance, { params });
  return resp.data;
};

export const makeTransfer = async (data: {
  type: number;
  amount: number;
  jwt_key: string;
}) => {
  const resp = await axiosInstance.post(endpoints.lotto.makeTransfer, data);
  return resp.data;
};

export const getCaptcha = async () => {
  const resp = await get(getUrl(`Account/Captcha`));

  return resp;
};

export const updateProfile = async (body: {
  FullName?: string;
  PhoneNumber?: string;
  EMail?: string;
}) => {
  const resp = await post(getUrl(`Account/UpdateProfile`), body);
  return resp;
};

export const getUserMail = async (body: {
  MailType: number;
  CurrentPage: number;
  PageSize: number;
}) => {
  const resp = await post(getUrl("System/GetUserMail"), body);

  return resp;
};

export const postRegisterName = async (AccountName: string) => {
  const resp = await post(getUrl(`Account/UpdateNickName`), {
    AccountName: AccountName,
  });
  return resp;
};

export const loginAccount = async (body: { jwt_key: string }) => {
  const res = await post(getUrl(`user/login`), body);
  return res.data;
};
export const signUpAccount = async (body: {
  aff_id: string;
  app_id: string;
  browser: string;
  os: string;
  DeviceId: string;
  DeviceType: string;
  LoginType: string;
  fg: string;
  ip_country: string;
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  utm_medium: string;
  utm_term: string;
  UserName: string;
  Password: string;
  repeat_pwd: string;
  UserReferral: string;
  FullName: string;
  PhoneNumber: string;
  AreaCode: string;
  Email: string;
  captcha: string;
  privateKey: string;
}) => {
  const res = await post(getUrl(`Account/CreateAccount`), body);
  return res;
};

export const changePassword = async (body: {
  OldPass: string;
  NewPass: string;
  PrivateKey: string;
  Captcha: string;
  Otp: string;
}) => {
  const resp = await post(getUrl("Account/ChangePassword"), body);

  return resp;
};

export const authConfig = {
  cookieTokenKeyName: `accessToken`,
  meEndpoint: getUrl("Account/GetAccountInfo"),
  loginEndpoint: getUrl("Account/login"),
  registerEndpoint: getUrl("Account/CreateAccount"),
};
