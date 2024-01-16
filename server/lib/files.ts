import fs from "fs";
import axios from "axios";
import path from "path";
import { file as filecfg} from "../config.json";
import crypto from "crypto";

export default {
  async download(url: string, filename: string) {
    const filepath = path.join(__dirname, "..", filecfg.upload, filename);
    this.mkdir(path.dirname(filepath));

    const writer = fs.createWriteStream(filepath);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      let buffer = new Buffer([]);
      response.data.on("data", (chunk: Buffer) => {
        buffer = Buffer.concat([buffer, chunk]);
      });
      writer.on("finish", () => {
        console.log();
        resolve({
          url: filename,
          path: filepath,
          hash: this.hash(buffer)
        });
      });
      writer.on("error", reject);
    });
  },

  exists(directory: string) {
    return fs.existsSync(directory);
  },

  mkdir(directory: string) {
    if (this.exists(directory)) return;
    fs.mkdirSync(directory);
  },

  del(file: string) {
    fs.unlinkSync(file);
  },

  rename(oldpath: string, newpath: string) {
    try {
      fs.renameSync(oldpath, newpath);
    } catch (error) {
      console.error(error);
    }
  },

  hash(buff: Buffer) {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(buff).digest("hex");
    return hash;
  }
};
