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

// Korean-aware subject-case 규칙
// - subject에 한글(Hangul)이 포함되면 case 검증 통과
// - 영어 전용이면 lower-case 강제 (Conventional Commits 원칙)
const koreanAwareSubjectCase = (parsed) => {
  const subject = parsed.subject || '';
  if (!subject) return [true];

  // 한글 유니코드 범위 매칭 — 포함 시 pass
  if (/\p{Script=Hangul}/u.test(subject)) return [true];

  // 영어 전용 subject는 lower-case 강제
  const firstAlpha = subject.match(/[A-Za-z]/);
  if (firstAlpha && firstAlpha[0] !== firstAlpha[0].toLowerCase()) {
    return [false, 'subject must be lower-case (English-only subjects)'];
  }
  return [true];
};

export default {
  extends: ['@commitlint/config-conventional'],

  plugins: [
    {
      rules: {
        'subject-case-korean-aware': koreanAwareSubjectCase,
      },
    },
  ],

  rules: {
    // 허용되는 타입 (Conventional Commits + 워크스페이스 관습)
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf', 'ci', 'build', 'style', 'revert'],
    ],

    // 기본 subject-case는 해제 (Korean-aware plugin이 대체)
    'subject-case': [0],

    // 한국어/영어 혼용 subject를 올바르게 검증
    'subject-case-korean-aware': [2, 'always'],

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
