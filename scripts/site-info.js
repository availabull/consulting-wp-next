#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function getComposerPackage(lock, name) {
  return lock.packages.find(pkg => pkg.name === name);
}

const lockPath = path.join(__dirname, '..', 'wordpress', 'composer.lock');
const composerLock = readJSON(lockPath);

const wp = getComposerPackage(composerLock, 'roots/wordpress');
const wpGraphql = getComposerPackage(composerLock, 'wpackagist-plugin/wp-graphql');

const nextPkg = readJSON(path.join(__dirname, '..', 'nextjs-site', 'package.json'));

const domain = process.env.DOMAIN || 'example.com';

const info = {
  siteName: domain,
  urls: {
    local: {
      next: 'http://localhost',
      wpAdmin: 'http://localhost:8080/wp/wp-admin',
      graphql: 'http://localhost/graphql'
    },
    production: {
      next: `https://${domain}`,
      nextWWW: `https://www.${domain}`,
      wordpress: `https://wp.${domain}`
    }
  },
  versions: {
    wordpress: wp ? wp.version : null,
    plugins: {
      'wp-graphql': wpGraphql ? wpGraphql.version : null
    },
    nextjs: nextPkg.dependencies.next,
    traefik: '3',
    mariadb: '11'
  },
  routes: {
    wordpress: {
      production: `wp.${domain}`,
      local: [
        'localhost/wp',
        'localhost/graphql',
        'localhost:8080/wp/wp-admin'
      ]
    },
    next: {
      production: [domain, `www.${domain}`],
      local: 'localhost'
    }
  }
};

console.log(JSON.stringify(info, null, 2));
