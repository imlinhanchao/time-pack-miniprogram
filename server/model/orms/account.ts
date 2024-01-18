import * as db from "../db";
import { prefix } from "../config.json";
const orm = {
  openid: {
    type: db.STRING(256),
    comment: "小程序 OpenID"
  },
  nickname: {
    type: db.STRING(20),
    comment: "昵称"
  },
  session_key: {
    type: db.STRING(256),
    comment: "会话密钥"
  },
  avatar: {
    type: db.STRING(200),
    comment: "头像"
  },
  lastlogin: {
    type: db.BIGINT,
    comment: "最后登录时间"
  }
};
export const table_name = prefix + "account";
export default { 
  db,
  tb: table_name,
  ...db.defineModel(table_name, orm, {
    comment: "用户表"
  }),
  keys: Object.keys(orm)
}
