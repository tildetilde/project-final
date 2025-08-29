// ESLint flat config for React 18 + TS 5.9 + Vite
// Needs: eslint ^8.57, @eslint/js ^8, typescript-eslint ^8,
// eslint-plugin-react ^7, eslint-plugin-react-hooks ^4,
// eslint-plugin-unused-imports ^3, globals ^15

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  { ignores: ["dist/**", "node_modules/**", "public/**", "coverage/**"] },

  js.configs.recommended,
  // TypeScript (no type-aware, snabb/stabil)
  ...tseslint.configs.recommended,
  // React
  react.configs.flat.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": hooks,
      "unused-imports": unusedImports,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Ny JSX-transform: kräver inte React i scope
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // Snällare textregler – du har UI-copy med apostrofer
      "react/no-unescaped-entities": "off",

      // Rensa oanvända imports/variabler
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // TS hygien – börja mjukt (du har några any just nu)
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],

      // Övrigt
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "react/prop-types": "off",
    },
  },
];
