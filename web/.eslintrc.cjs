const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx'];
const allExtensions = [...typeScriptExtensions, '.js', '.jsx'];
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    // 'plugin:@typescript-eslint/strict-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/extensions': allExtensions,
    'import/resolver': {
      typescript: {},
      node: {
        extensions: allExtensions,
      },
      alias: {
        map: [
          ['@root', './'],
          ['@common', './src'],
          ['@admin', './admin'],
          ['@home', './home'],
        ],
      },
    },
  },
  plugins: ['react-refresh', '@typescript-eslint', 'import'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'no-trailing-spaces': 'error',
    'no-irregular-whitespace': 'error',
    'no-multi-spaces': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'import/order': [
      'error',
      {
        groups: [
          'type',
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling'],
          'index',
          'unknown',
        ],
        pathGroups: [
          {
            pattern: '@*/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '@*/*.scss',
            group: 'sibling',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        "warnOnUnassignedImports": true,
      },
    ],
  },
}
