import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';

export default [
  {
    languageOptions: { globals: globals.browser },

    files: ['__tests__/**/*'],
    plugins: {
      jest,
    },
    env: { 'jest/globals': true },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
