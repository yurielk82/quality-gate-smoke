// eslint.config.express.mjs — Express/Node 서버 프로젝트용 확장

import base from './eslint.config.base.mjs';

export default [
  ...base,
  {
    // 라우터/핸들러
    files: ['src/routes/**/*.{ts,js}', 'src/handlers/**/*.{ts,js}', 'src/controllers/**/*.{ts,js}'],
    rules: {
      'max-lines-per-function': ['error', 100],
    },
  },
  {
    // 서비스/리포지토리 — 기본 80줄
    files: ['src/services/**/*.{ts,js}', 'src/repositories/**/*.{ts,js}'],
    rules: {
      'max-lines-per-function': ['error', 80],
    },
  },
  {
    // 마이그레이션/시드는 매우 관대
    files: ['**/migrations/**/*.{ts,js}', '**/seeds/**/*.{ts,js}'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
];
