import * as db from "../db";
import { prefix } from "../config.json";
const orm = {
  username: {
    type: db.STRING(20),
    comment: "登录帐号"
  },
  nickname: {
    type: db.STRING(20),
    comment: "昵称"
  },
  passwd: {
    type: db.STRING(64),
    comment: "密码"
  },
  avatar: {
    type: db.STRING(200),
    comment: "头像"
  },
  roles: {
    type: db.TEXT,
    comment: "角色"
  },
  lastlogin: {
    type: db.INTEGER,
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
