import fs from "fs";
import path from "path";
import readline from "readline";
import { v4 as uuidv4 } from "uuid";
import pkg from "../package.json";
import { sync } from "../model";

const config = {
  name: pkg.description || "",
  port: 3000,
  accessSecret: "",
  refreshSecret: "",
  salt: "",
  file: {
    upload: "/public/upload/",
    fileurl: "/upload/",
    maxSize: 2
  }
};

const db = {
  host: "localhost",
  user: "",
  password: "",
  database: "app",
  dialect: "mysql",
  prefix: "pwr_",
  port: 3306,
  logging: false
};

const randomStr = () => randomUp(Math.random().toString(36).slice(2));
const randomUp = (s: string) =>
  s
    .split("")
    .map(s => (Math.ceil(Math.random() * 10) % 2 ? s : s.toUpperCase()))
    .join("");

export async function main() {
  const rl: readline.Interface & {
    inputData?: (key: string, defaultVal?: string) => Promise<string>;
  } = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.inputData = function (key, defaultVal='') {
    return new Promise((resolve, reject) => {
      try {
        this.question(
          `${key}: ` + (defaultVal ? `[${defaultVal}]` : ""),
          function (val) {
            resolve(val || defaultVal);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  console.info("Let's config .");

  if (
    config.accessSecret == "" ||
    (await rl.inputData(
      "Do you want to reset safe key config (accessSecret etc.) ?",
      "N"
    )) == "Y"
  ) {
    config.accessSecret = randomStr() + randomStr();
    config.refreshSecret = randomStr() + randomStr();
    config.salt = randomUp(uuidv4());
  }
  config.port = parseInt(await rl.inputData("Port", config.port.toString()));
  config.file.maxSize = parseFloat(await rl.inputData(
    "Max Size File Upload(MB)",
    config.file.maxSize.toString()
  ));

  db.port = parseInt(await rl.inputData("Database Port", db.port.toString()));
  db.database = await rl.inputData("Database Name", db.database);
  db.prefix = await rl.inputData("Table Prefix", db.prefix);
  db.logging =
    (await rl.inputData("Log SQL Execute", db.logging ? "Y" : "N")) == "Y";

  db.host = await rl.inputData("Database Host", "localhost");
  db.user = await rl.inputData("Database User", "root");
  db.password = await rl.inputData("Database Password", "");

  fs.writeFile(
    path.join(__dirname, "../server/config.json"),
    JSON.stringify(config, null, 4),
    err => {
      if (err) console.error(`Save website config failed: ${err.message}`);
      else {
        // Save DB Config
        fs.writeFile(
          path.join(__dirname, "../server/model/config.json"),
          JSON.stringify(db, null, 4),
          err => {
            if (err) console.error(`Save db config failed: ${err.message}`);
            else initDB();
          }
        );
      }
    }
  );
  rl.close();
}

export function initDB() {
  (async () => {
    try {
      await sync();
      console.info("Init all model finish.");
    } catch (err: any) {
      console.error(`Init model failed: ${err.message}`);
    }
    console.info(
      "Please execute 'npm run build' to build frontend, and then execute 'npm start' to start the website."
    );
    process.exit();
  })();
}

