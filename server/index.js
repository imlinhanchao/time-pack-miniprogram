#!/usr/bin/env node

/**
 * Time Pack Production & Development Entry Point
 */

const fs = require('fs');
const path = require('path');

const distEntry = path.join(__dirname, 'dist', 'index.js');

if (fs.existsSync(distEntry)) {
  require(distEntry);
} else {
  try {
    require('ts-node/register');
    require('tsconfig-paths/register');
    require('./index.ts');
  } catch (err) {
    console.error('[Error] dist/index.js not found. Please run `npm run build` first.');
    process.exit(1);
  }
}
