/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: IAccount,
    apiUrl: string,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface IRsp<T> {
  state: number;
  msg: string;
  data: T;
}