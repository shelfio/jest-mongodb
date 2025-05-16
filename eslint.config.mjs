import rules from '@shelf/eslint-config/typescript.js';

export default [
  ...rules,
  {
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.json']},
  {
    ignores: [
      '.idea/',
      'coverage/',
      'draft.js',
      'lib/',
      'dist/',
      'node_modules/',
      'packages/**/tsconfig.types.json',
      'packages/**/node_modules/**',
      'packages/**/lib/**',
      'renovate.json',
    ],
  },
];
