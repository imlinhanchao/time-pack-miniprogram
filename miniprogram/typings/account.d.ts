interface ILoginWx {
  code: string;
}

interface IAccount {
  openid?: string;
  nickname: string;
  avatar: string;
  lastlogin: number;
  accessToken?: string;
  refreshToken?: string;
  expires?: number;
}
