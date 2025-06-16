import path from "path";
import fs from "fs";
import App from "./app";
import files from "../lib/files";

import { file as filecfg} from "../config.json";
import { Request } from "express";

const __error__: any = Object.assign({}, App.error);
__error__.toobig = App.error.reg("上传文件过大！");

class Lib extends App {
  session: any;
  constructor(session: any) {
    super([{ fun: App.ok, name: "upload", msg: "上传成功" }]);
    this.session = session;
  }

  get error() {
    return __error__;
  }

  async upload(req: Request) {
    try {
      const dirpath = path.join(process.cwd(), filecfg.upload);
      files.mkdir(dirpath);
      const filenames = [];
      const reqFiles = req.files as Express.Multer.File[];
      for (let i = 0; i < reqFiles.length; i++) {
        if (reqFiles[i].size > filecfg.maxSize * 1024 * 1024) {
          throw this.error.toobig;
        }
        const data = reqFiles[i].buffer;
        const hash = files.hash(data);
        const filename = hash + path.extname(reqFiles[i].originalname);
        const savepath = path.join(dirpath, filename);
        if (!files.exists(savepath)) fs.writeFileSync(savepath, data);
        filenames.push({
          url: path.join(filecfg.fileurl, filename),
          originalname: reqFiles[i].originalname,
          filename
        });
      }
      return this.ok.upload(filenames);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default Lib;
