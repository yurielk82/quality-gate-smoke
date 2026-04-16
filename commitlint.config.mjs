// Commitlint — Conventional Commits 기반 커밋 메시지 검증
//
// 파일명: commitlint.config.mjs (ES Module 필수 — wagoid/commitlint-github-action@v6 제약)
//
// 의존성 설치:
//   npm i -D @commitlint/cli @commitlint/config-conventional
//
// CI: .github/workflows/quality-gate.yml의 commit-lint job이 PR마다 실행
// 로컬 검증: npx commitlint --from=HEAD~1
//
// 참고: https://commitlint.js.org/reference/configuration.html

export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // 허용되는 타입 (Conventional Commits + 워크스페이스 관습)
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf', 'ci', 'build', 'style', 'revert'],
    ],

    // subject가 한국어/영문 혼용이므로 case 강제 해제
    // 영어 전용 프로젝트는 다음 규칙으로 교체:
    //   'subject-case': [2, 'always', 'lower-case']
    'subject-case': [0],

    // 헤더(type(scope): subject) 최대 길이
    'header-max-length': [2, 'always', 100],

    // subject 비어 있으면 차단
    'subject-empty': [2, 'never'],

    // 타입 비어 있으면 차단 (feat: 누락 등)
    'type-empty': [2, 'never'],

    // body/footer 앞 빈 줄 강제 (conventional-commits 표준)
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
