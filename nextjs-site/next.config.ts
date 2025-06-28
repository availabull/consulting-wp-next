import type { NextConfig } from "next";

/**
 * Build a stand‑alone bundle so the Docker image
 * can run with `node .next/standalone/server.js`
 */
const nextConfig: NextConfig = {
  output: "standalone",
  // add additional Next.js options below if you need them
};

export default nextConfig;
