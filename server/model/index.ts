import * as db from "./db";
import path from "path";
import { glob } from "glob";
import { ModelStatic } from "sequelize";
const ormsdir = "/orms";

const loadFilter = path.relative(process.cwd(), path.join(__dirname, ormsdir, '*.ts')).replace(/\\/g, '/');
const files = glob.sync(loadFilter);

const models: Record<string, ModelExt> = {};

files.forEach(async (file) => {
  const name = path.basename(file.replace(/\.ts$/, ''));
  file = './orms/' + name;
  const model = await import(file);
  if (!model) return;
  models[name] = model;
});

export const sync = async () => {
  await db.sync();
};

export default models;

export type ModelExt = ModelStatic<any> & {
  db: typeof db;
  tb: string;
  keys: string[];
}
