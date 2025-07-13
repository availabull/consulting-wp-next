const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build a stand‑alone bundle so the Docker image
  // can run with `node .next/standalone/server.js`
  output: 'standalone',

  // Leverage Next.js’ built‑in Tailwind v4 loader
  experimental: { tailwindcss: true },

  // Expose the "@/…" alias to both Webpack and Node
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  }
};

module.exports = nextConfig;
