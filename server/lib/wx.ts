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
}