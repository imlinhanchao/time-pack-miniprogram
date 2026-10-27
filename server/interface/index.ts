import { glob } from "glob";
import path from "path";
const loadFilter = path.relative(process.cwd(), path.resolve(__dirname, '*.{ts,js}')).replace(/\\/g, '/');
const files = glob.sync(loadFilter, { ignore: ['**/*.d.ts', '**/*.map'] });
const apps: Record<string, any> = {};

files.forEach(async (file) => {
  if (file.endsWith('index.ts') || file.endsWith('index.js')) return;
  const name = path.basename(file.replace(/\.(ts|js)$/, ''));
  file = './' + name;
  const app = require(file).default;
  if (!app) return;
  apps[name] = app;
});

export default apps;