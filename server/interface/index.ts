import { glob } from "glob";
import path from "path";
const loadFilter = path.relative(process.cwd(), path.resolve(__dirname, '*.ts')).replace(/\\/g, '/');
const files = glob.sync(loadFilter);
const apps: Record<string, any> = {};

files.forEach(async (file) => {
  if (file.endsWith('index.ts')) return;
  const name = path.basename(file.replace(/\.ts$/, ''));
  file = './' + name;
  const app = require(file).default;
  if (!app) return;
  apps[name] = app;
});

export default apps;