import axios from "axios";
import { wx } from '@/config.json';

export default class WxApi {
  static async login(code: string) {
    const data = {
      appid: wx.appid,  
      secret: wx.secret,
      js_code: code,  
      grant_type:'authorization_code'
    }

    return await axios.get('https://api.weixin.qq.com/sns/jscode2session', { params: data })
      .then(res => res.data);
  }

  static async getAccessToken() {
    const data = {
      appid: wx.appid,
      secret: wx.secret,
      grant_type: 'client_credential'
    }

    return await axios.get('https://api.weixin.qq.com/cgi-bin/token', { params: data })
      .then(res => res.data);
  }

  static async sendSubscribeMessage(accessToken: string, openid: string, page: string, data: any) {
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;
    const body = {
      touser: openid,
      template_id: '1hFdlq3ysKkG6YI-76cZg0PzgSJG6uKdKZDiRfNBz2s',
      page: page,
      data: data
    };

    return await axios.post(url, body)
      .then(res => res.data);
  }
}