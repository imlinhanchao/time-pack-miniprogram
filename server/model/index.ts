import fs from "fs";
import * as db from "./db";
import path from "path";
import { glob } from "glob";
import { Model, ModelStatic } from "sequelize";
const ormsdir = "/orms";

const files = glob.sync(path.join(ormsdir, '*.ts').replace(/\\/g, '/'));

const models: Record<string, ModelExt> = {};

for (const f of files) {
  console.info(`import model from file ${f}...`);
  const name = f.substring(0, f.length - 3);
  models[name] = require(__dirname + ormsdir + "/" + f);
}

export const sync = async () => {
  await db.sync();
};

export default models;

export type ModelExt = ModelStatic<any> & {
  db: typeof db;
  tb: string;
  keys: string[];
}
