import { glob } from "glob";
import path from "path";
const files = glob.sync(path.join('*.ts').replace(/\\/g, '/'));
const apps: Record<string, any> = {};

for (const f of files) {
  if (f == 'index.ts') continue;
  console.info(`import model from file ${f}...`);
  const name = f.substring(0, f.length - 3);
  apps[name] = require(__dirname + "/" + f);
}

export default apps;