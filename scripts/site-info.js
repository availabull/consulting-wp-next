#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function getComposerPackage(lock, name) {
  return lock.packages.find(pkg => pkg.name === name);
}

// Load Composer lock and Next.js package.json
const lockPath = path.join(__dirname, '..', 'wordpress', 'composer.lock');
const composerLock = readJSON(lockPath);

const wp = getComposerPackage(composerLock, 'roots/wordpress');
const wpGraphql = getComposerPackage(composerLock, 'wpackagist-plugin/wp-graphql');

const nextPkg = readJSON(path.join(__dirname, '..', 'nextjs-site', 'package.json'));

// Determine the base domain from environment or WP_HOME, fallback to default
const wpHome = process.env.WP_HOME;
let baseDomain = process.env.SITE_DOMAIN;
if (!baseDomain && wpHome) {
  try {
    const host = new URL(wpHome).hostname;
    // Strip leading subdomains wp. or www.
    baseDomain = host.replace(/^wp\./, '').replace(/^www\./, '');
  } catch {
    // ignore malformed WP_HOME
  }
}
if (!baseDomain) {
  baseDomain = 'robertfisher.com';
}

// Build info object
const info = {
  siteName: baseDomain,
  urls: {
    local: {
      next: 'http://localhost',
      wpAdmin: 'http://localhost:8080/wp/wp-admin',
      graphql: 'http://localhost/graphql'
    },
    production: {
      next: `https://${baseDomain}`,
      nextWWW: `https://www.${baseDomain}`,
      wordpress: `https://wp.${baseDomain}`
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
      production: `wp.${baseDomain}`,
      local: [
        'localhost/wp',
        'localhost/graphql',
        'localhost:8080/wp/wp-admin'
      ]
    },
    next: {
      production: [baseDomain, `www.${baseDomain}`],
      local: 'localhost'
    }
  }
};

console.log(JSON.stringify(info, null, 2));