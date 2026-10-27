import fs from "fs";
import path from "path";

export interface IDBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  dialect: string;
  prefix: string;
  port: number;
  logging: boolean;
}

const defaultDB: IDBConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "app",
  dialect: "mysql",
  prefix: "time_",
  port: 3306,
  logging: false
};

function loadDBConfig(): IDBConfig {
  // 1. Try to load from model/config.json
  const candidateModelPaths = [
    path.join(__dirname, "config.json"),
    path.join(__dirname, "../model/config.json"),
    path.join(__dirname, "../../model/config.json"),
    path.join(process.cwd(), "model/config.json"),
    path.join(process.cwd(), "dist/model/config.json")
  ];

  for (const p of candidateModelPaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, "utf-8");
        return Object.assign({}, defaultDB, JSON.parse(content));
      } catch (e: any) {
        console.error(`[Error] Failed to read db config from ${p}:`, e.message);
      }
    }
  }

  // 2. Try to load from main config.json if it contains a `db` property
  const candidateServerPaths = [
    path.join(__dirname, "../config.json"),
    path.join(__dirname, "../../config.json"),
    path.join(process.cwd(), "config.json"),
    path.join(process.cwd(), "dist/config.json"),
    path.join(__dirname, "config.json")
  ];

  for (const p of candidateServerPaths) {
    if (fs.existsSync(p)) {
      try {
        const rootCfg = JSON.parse(fs.readFileSync(p, "utf-8"));
        if (rootCfg && rootCfg.db) {
          return Object.assign({}, defaultDB, rootCfg.db);
        }
      } catch (e) {}
    }
  }

  return defaultDB;
}

const dbConfig = loadDBConfig();

export const prefix = dbConfig.prefix || "time_";
export default dbConfig;
