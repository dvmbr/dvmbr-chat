import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/out/**",
    "**/*.d.ts",
    "**/next-env.d.ts",
  ]),

  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    extends: [...tseslint.configs.recommended],
  },

  {
    files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    extends: [...nextVitals, ...nextTs],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },

  {
    files: ["apps/socket-server/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./apps/socket-server/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
