import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'node_modules/', '.vercel/']),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs['flat/recommended'],
  // Accessibility rules for Astro templates (uses eslint-plugin-jsx-a11y-x under the hood)
  astro.configs['flat/jsx-a11y-recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
]);
