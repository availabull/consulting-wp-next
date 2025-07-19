#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const nextPkg = path.resolve(__dirname, '../node_modules/next/package.json');

if (!fs.existsSync(nextPkg)) {
  console.error('Next.js is not installed. Run "pnpm install" in nextjs-site/ before linting.');
  process.exit(1);
}
