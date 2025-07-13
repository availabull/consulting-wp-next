import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/components/ui/**/*.{ts,tsx}"
  ],
  theme: { extend: {} },
  plugins: []
};

export default config;
