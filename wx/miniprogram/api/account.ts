import { Http } from '../utils/fetch';

export function login(data: ILoginWx) {
  return Http.post<IAccount>('/account/loginWx', data);
}

export function refreshToken(refreshToken: string) {
  return Http.post<IAccount>('/account/refreshToken', { refreshToken });
}

export function updateUserInfo(data: any) {
  return Http.post<IAccount>('/account/update',  data );
}

export function upload(data: any) {
  return Http.post('/update',  data );
}