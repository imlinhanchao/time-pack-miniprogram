import * as db from "../db";
import { prefix } from "../config.json";
const orm = {
  user: {
    type: db.STRING(256),
    comment: "所属用户",
  },
  title: {
    type: db.STRING(20),
    comment: "标题",
  },
  content: {
    type: db.TEXT,
    comment: "内容",
  },
  time_out: {
    type: db.BIGINT,
    comment: "到期时间",
  },
  type: {
    type: db.INTEGER,
    comment: "类型，1：文字，2：图片，3：视频，4：音频",
  },
  gift: {
    type: db.BOOLEAN,
    comment: "是否礼物",
  },
  status: {
    type: db.INTEGER,
    comment: "状态，0：待领取，1：已封存，2：已开启",
  },
  create_user: {
    type: db.STRING(256),
    comment: "创建用户",
  },
  create_nick: {
    type: db.STRING(256),
    comment: "创建用户昵称",
  },
  create_avatar: {
    type: db.STRING(256),
    comment: "创建用户头像地址",
  },
};
export const table_name = prefix + "capsule";
export default Object.assign(
  db.defineModel(table_name, orm, {
    comment: "时间胶囊表",
  }),
  {
    db,
    tb: table_name,
    keys: Object.keys(orm),
  }
);
