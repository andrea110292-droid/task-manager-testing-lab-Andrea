const jsxA11y = require('eslint-plugin-jsx-a11y');
const react = require('eslint-plugin-react');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['src/**/*.tsx', 'src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
      react: react,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
    settings: {
      'jsx-a11y': {
        // React Native no usa elementos HTML nativos, ajustamos el polyfill de componentes
        components: {
          Pressable: 'button',
          TouchableOpacity: 'button',
          TextInput: 'input',
        },
      },
    },
  },
];
