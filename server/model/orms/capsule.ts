import * as db from "../db";
import { prefix } from "../config.json";
const orm = {
  user: {
    type: db.STRING(20),
    comment: "所属用户"
  },
  title: {
    type: db.STRING(20),
    comment: "标题"
  },
  content: {
    type: db.TEXT,
    comment: "内容"
  },
  time_out: {
    type: db.INTEGER,
    comment: "到期时间"
  },
  type: {
    type: db.INTEGER,
    comment: "类型，1：文字，2：图片，3：视频，4：音频"
  },
  status: {
    type: db.INTEGER,
    comment: "状态，1：正常，2：已开启"
  },
  create_user: {
    type: db.STRING(20),
    comment: "创建用户"
  },
};
export const table_name = prefix + "capsule";
export default { 
  db,
  tb: table_name,
  ...db.defineModel(table_name, orm, {
    comment: "时间胶囊表"
  }),
  keys: Object.keys(orm)
}
