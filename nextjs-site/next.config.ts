// next.config.ts
import path from "node:path";
import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

/**
 * Build a stand‑alone bundle so the Docker image
 * can run with `node .next/standalone/server.js`
 *
 *  • `output: "standalone"`  – Next.js bundles the server and its deps
 *  • `webpack()`             – adds "@/…" alias for both Webpack and Node
 */
const nextConfig: NextConfig = {
  output: "standalone",

  /** Expose the "@/…" alias to both Webpack and Node. */
  webpack(config: WebpackConfig) {
    // Ensure objects exist before mutating
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
