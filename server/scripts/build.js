#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('📦 Starting server build...\n');

// 1. Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✔ Cleaned dist directory');
}

// 2. Compile TypeScript
console.log('⏳ Compiling TypeScript...');
try {
  const tsJsBin = path.resolve(rootDir, 'node_modules/typescript/bin/tsc');
  const tscCmd = fs.existsSync(tsJsBin) ? `"${process.execPath}" "${tsJsBin}"` : 'npx --no-install tsc';
  execSync(tscCmd, { cwd: rootDir, stdio: 'inherit' });
  console.log('✔ TypeScript compiled successfully');
} catch (error) {
  console.error('✖ TypeScript compilation failed');
  process.exit(1);
}

// 3. Copy static asset directories
const copyDir = (src, dest, name) => {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✔ Copied ${name} -> dist/${name}`);
  }
};

copyDir(path.resolve(rootDir, 'views'), path.resolve(distDir, 'views'), 'views');
copyDir(path.resolve(rootDir, 'public'), path.resolve(distDir, 'public'), 'public');

// 4. Ensure upload directory exists
const uploadDir = path.resolve(distDir, 'public/upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✔ Created dist/public/upload directory');
}

// 5. Copy config files if they exist in source directory
const serverConfig = path.resolve(rootDir, 'config.json');
const distConfig = path.resolve(distDir, 'config.json');
let parsedServerConfig = null;
if (fs.existsSync(serverConfig)) {
  fs.copyFileSync(serverConfig, distConfig);
  console.log('✔ Copied config.json -> dist/config.json');
  try {
    parsedServerConfig = JSON.parse(fs.readFileSync(serverConfig, 'utf-8'));
  } catch (e) {}
}

const modelConfig = path.resolve(rootDir, 'model/config.json');
const distModelConfig = path.resolve(distDir, 'model/config.json');
if (fs.existsSync(modelConfig)) {
  fs.mkdirSync(path.dirname(distModelConfig), { recursive: true });
  fs.copyFileSync(modelConfig, distModelConfig);
  console.log('✔ Copied model/config.json -> dist/model/config.json');
} else if (parsedServerConfig && parsedServerConfig.db) {
  fs.mkdirSync(path.dirname(distModelConfig), { recursive: true });
  fs.writeFileSync(distModelConfig, JSON.stringify(parsedServerConfig.db, null, 4));
  console.log('✔ Generated dist/model/config.json from config.json (db field)');
}

// 6. Ensure package.json is present in dist
const pkgSrc = path.resolve(rootDir, 'package.json');
const pkgDest = path.resolve(distDir, 'package.json');
if (fs.existsSync(pkgSrc) && !fs.existsSync(pkgDest)) {
  fs.copyFileSync(pkgSrc, pkgDest);
  console.log('✔ Copied package.json -> dist/package.json');
}

console.log('\n🎉 Build completed successfully!');
console.log('To run in production:');
console.log('  npm start (or node dist/index.js)\n');
