// eslint.config.base.mjs — CLAUDE.md 품질 규칙 기본 세트
// 프로젝트별 eslint.config.mjs에서 import 후 확장

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import sonarjs from 'eslint-plugin-sonarjs';

export const baseRules = {
  // CLAUDE.md 하드 룰 (워크스페이스 기준)
  // 임계값 근거 (Codex 리뷰 반영):
  //   max-lines 300: personal/code-quality.md 금기 항목 (엄격 유지)
  //   max-lines-per-function 80: personal/code-quality.md 명시
  //   max-depth 3: 중첩 3단계 이상 금지 (early return 강제)
  //   max-params 5: NestJS DI 생성자 (보통 4-6개) 수용 — 4는 과도 오탐
  //   complexity 15: Google/Airbnb 기준. 10은 switch/case 많은 함수에서 빈번 발화
  'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
  'max-lines-per-function': ['error', { max: 80, skipBlankLines: true, skipComments: true, IIFEs: true }],
  'max-depth': ['error', 3],
  'max-params': ['error', 5],
  'complexity': ['error', 15],

  // 소프트 룰 (warn으로 시작, 안정화 후 error 승격)
  'no-magic-numbers': ['warn', {
    ignore: [-1, 0, 1, 2, 10, 24, 60, 100, 200, 400, 401, 403, 404, 500, 1000, 1024],
    ignoreArrayIndexes: true,
    ignoreDefaultValues: true,
    enforceConst: true,
    detectObjects: false,
  }],
  'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],
  'sonarjs/no-identical-functions': 'warn',
  'sonarjs/cognitive-complexity': ['warn', 15],
  'sonarjs/no-all-duplicated-branches': 'error',
  'sonarjs/no-collapsible-if': 'warn',

  // TypeScript 금기 (CLAUDE.md 명시)
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/ban-ts-comment': ['error', {
    'ts-ignore': 'allow-with-description',
    'ts-expect-error': 'allow-with-description',
    minimumDescriptionLength: 10,
  }],

  // 디버깅 잔재
  'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
  'no-debugger': 'error',

  // 에러 처리 (RCA 원칙)
  'no-empty': ['error', { allowEmptyCatch: false }],
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
};

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { sonarjs },
    rules: baseRules,
  },
  {
    // 테스트는 완화
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/__tests__/**', '**/test/**'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-identical-functions': 'off',
    },
  },
  {
    // Next.js 페이지/레이아웃/API 라우트 — max-lines 500으로 완화
    // (메타데이터 + 서버 액션 + 클라이언트 UI가 한 파일에 몰리는 Next.js 관행 수용)
    files: [
      '**/app/**/page.{ts,tsx,js,jsx}',
      '**/app/**/layout.{ts,tsx,js,jsx}',
      '**/app/**/route.{ts,tsx,js,jsx}',
      '**/pages/**/*.{ts,tsx,js,jsx}',
    ],
    rules: {
      'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // NestJS 모듈/컨트롤러/서비스 — DI 생성자 파라미터 6개까지 허용
    files: ['**/*.module.ts', '**/*.controller.ts', '**/*.service.ts'],
    rules: {
      'max-params': ['error', 6],
    },
  },
  {
    // 생성물 + ESLint config 파일 자체 무시
    // (config에 임계값 literal이 들어가므로 no-magic-numbers 재귀 적용 회피)
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/out/**',
      '**/coverage/**',
      '**/*.generated.{ts,tsx,js,jsx}',
      '**/*.pb.{ts,js}',
      '**/migrations/**',
      'eslint.config.{mjs,js,cjs,ts}',
      'eslint.config.*.{mjs,js,cjs,ts}',
    ],
  },
);
