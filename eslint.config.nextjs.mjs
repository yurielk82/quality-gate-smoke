// eslint.config.nextjs.mjs — Next.js 프로젝트용 확장
// JSX 현실 반영 + a11y (WCAG 2.2) 강제
//
// 사용법 (프로젝트 루트 eslint.config.mjs):
//   import base from './path/to/eslint.config.nextjs.mjs';
//   export default base;
//
// 의존성:
//   npm i -D eslint-plugin-jsx-a11y

import base from './eslint.config.base.mjs';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  ...base,

  // JSX/TSX 파일에 jsx-a11y 규칙 적용 (접근성 WCAG 2.2 기본선)
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      // 필수(error): alt 누락, aria 오용, 키보드 접근 불가 요소
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      // WCAG 2.2 기본선 추가 (Codex 리뷰 반영)
      'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',

      // 경고(warn): 초기 도입 마찰 완화
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
    },
  },

  {
    files: [
      'src/components/**/*.{tsx,jsx}',
      'src/app/**/page.{tsx,jsx}',
      'src/app/**/layout.{tsx,jsx}',
      'src/app/**/error.{tsx,jsx}',
      'src/app/**/loading.{tsx,jsx}',
      'app/**/page.{tsx,jsx}',
      'app/**/layout.{tsx,jsx}',
    ],
    rules: {
      // React 컴포넌트는 JSX 때문에 자연히 김
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      // JSX 중첩은 3단계로 판정하기 어려움
      'max-depth': ['warn', 4],
      // Tailwind class 반복은 일반적
      'sonarjs/no-duplicate-string': ['warn', { threshold: 5 }],
    },
  },
  {
    // app/ 라우트 및 API 라우트
    files: ['src/app/**/route.{ts,js}', 'app/**/route.{ts,js}', 'pages/api/**/*.{ts,js}'],
    rules: {
      'max-lines-per-function': ['error', 120],
    },
  },
];
