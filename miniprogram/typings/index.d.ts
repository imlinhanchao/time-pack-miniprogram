/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: IAccount,
    apiUrl: string,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}