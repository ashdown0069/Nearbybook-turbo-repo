import { config } from "@repo/eslint-config/base";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
