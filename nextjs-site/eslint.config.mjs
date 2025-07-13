import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import eslintPluginImport from "eslint-plugin-import";
import typescriptParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/**
 * Convert classic ESLint shareable‑config syntax (`extends`)
 * into the new “flat” config format.
 */
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1) Next.js & TypeScript best‑practice presets
  ...compat.extends(
    "next/core-web-vitals",  // performance & a11y rules
    "next/typescript"        // sensible TS defaults
  ),

  // 2) Custom settings for TS files and @/ alias resolution
  {
    /* Apply only to TypeScript source */
    files: ["**/*.ts", "**/*.tsx"],

    /* Tell ESLint to parse with @typescript-eslint */
    languageOptions: {
      parser: typescriptParser,
      sourceType: "module",
    },

    /* Make eslint-plugin-import understand TS paths & “@/…” */
    settings: {
      "import/resolver": {
        typescript: {},           // honors tsconfig paths
        node: { paths: ["src"] }, // "@/…" → "./src/…"
      },
    },

    plugins: {
      import: eslintPluginImport,
    },

    /* Add or override rules here */
    rules: {
      // e.g. "import/order": ["error", { "alphabetize": { "order": "asc" } }],
    },
  },
];
