module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  // need dependency : 'eslint-plugin-simple-import-sort'
  plugins: [
    'prettier',
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
  ],
  extends: [
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['**/*.js', '**/*.ts', '**/*.tsx'],
      rules: {
        'max-len': ['error', { code: 120 }],
        'simple-import-sort/imports': [
          'error',
          {
            // 1. start with (@ or ~)
            // 2. start with (alphabet)
            // 3. start with (../)
            // 4. start with (./)
            groups: [
              [
                '^@',
                '^~',
                '^[a-z]',
                '^\\.\\.(?!/?$)',
                '^\\.\\./?$',
                '^\\./(?=.*/)(?!/?$)',
                '^\\.(?!/?$)',
                '^\\./?$',
              ],
            ],
          },
        ],
      },
    },
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
