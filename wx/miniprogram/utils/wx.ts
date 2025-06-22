import { login, refreshToken } from "../api/account";

const app = getApp<IAppOption>();

export function wxlogin(app: WechatMiniprogram.App.Instance<IAppOption>) {
  return new Promise(async (resolve, reject) => {
    let userInfo = wx.getStorageSync<IAccount|null>('user');
    if ((userInfo?.expires || 0) < Date.now() && userInfo?.refreshToken) {
      try {
        const token = userInfo.refreshToken;
        userInfo = null;
        const res = await refreshToken(token);
        userInfo = res;
        wx.setStorageSync('user', userInfo)
      } catch (error) {}
    }
    if (userInfo?.openid) {
      app.globalData.userInfo = userInfo;
      return resolve(app.globalData.userInfo);
    }

    wx.login({
      success: res => {
        login({ code: res.code }).then(res => {
          app.globalData.userInfo = res;
          wx.setStorageSync('user', res)
          resolve(res);
        })
      },
      fail: reject,
    })
  })
}

export enum MsgType {
  receive = '', // 申请中，待补充
  open = '1hFdlq3ysKkG6YI-76cZg0PzgSJG6uKdKZDiRfNBz2s',
}

export function wxSubscribe(msgTypes: MsgType[]) {
  return wx.requestSubscribeMessage({
      tmplIds: msgTypes,
      success (res) { 
        console.log('wxSubscribe', res);
      },
      catch (err: any) {
        console.log('wxSubscribe Error', err);
      }
    })
}