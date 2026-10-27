import fs from "fs";
import path from "path";

export interface IServerConfig {
  name: string;
  port: number;
  accessSecret: string;
  refreshSecret: string;
  salt: string;
  wx: {
    appid: string;
    secret: string;
  };
  file: {
    upload: string;
    fileurl: string;
    maxSize: number;
  };
  db?: any;
}

const defaultConfig: IServerConfig = {
  name: "time-pack",
  port: 3000,
  accessSecret: "",
  refreshSecret: "",
  salt: "",
  wx: {
    appid: "",
    secret: ""
  },
  file: {
    upload: "/public/upload/",
    fileurl: "/upload/",
    maxSize: 2
  }
};

export function findConfigFile(): string | null {
  const candidates = [
    path.join(__dirname, "config.json"),
    path.join(__dirname, "../config.json"),
    path.join(process.cwd(), "config.json"),
    path.join(process.cwd(), "dist/config.json"),
    path.join(__dirname, "../../config.json")
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

function loadConfig(): IServerConfig {
  const configFile = findConfigFile();
  if (configFile) {
    try {
      const content = fs.readFileSync(configFile, "utf-8");
      return Object.assign({}, defaultConfig, JSON.parse(content));
    } catch (e: any) {
      console.error(`[Error] Failed to read config file from ${configFile}:`, e.message);
    }
  }
  return defaultConfig;
}

const config = loadConfig();

export const name = config.name;
export const port = config.port;
export const accessSecret = config.accessSecret;
export const refreshSecret = config.refreshSecret;
export const salt = config.salt;
export const wx = config.wx;
export const file = config.file;
export const db = config.db;

export default config;
