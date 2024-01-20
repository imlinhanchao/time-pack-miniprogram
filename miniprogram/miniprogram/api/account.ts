import { Http } from '../utils/fetch';

export interface ILoginWx {
  code: string;
}

export interface IAccount {
  openid?: string;
  nickname: string;
  avatar: string;
  lastlogin: number;
  accessToken?: string;
  refreshToken?: string;
  expires?: number;
}

export function login(data: ILoginWx) {
  return Http.post<IAccount>('/account/login', data);
}