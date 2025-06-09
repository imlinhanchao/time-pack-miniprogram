/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: IAccount,
    apiUrl: string,
    imgUrl:string,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface IRsp<T> {
  state: number;
  msg: string;
  data: T;
}

interface IPageRsp<T> {
  state: number;
  msg: string;
  data: IPage<T>;
}

interface IPage<T> {
  list: T[];
  total: number;
  currentPage: number;
  pageSize: number;
}