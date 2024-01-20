import { Http } from '../utils/fetch';

export function login(data: ILoginWx) {
  return Http.post<IAccount>('/account/loginWx', data);
}

export function refreshToken(refreshToken: string) {
  return Http.post<IAccount>('/account/refreshToken', { refreshToken });
}