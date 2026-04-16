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
// - 한글 2글자 이상 포함 시 한국어 주체로 간주 → case 검증 통과
//   (현실 반영: 한국어 기술 commit은 영어 용어 다수 포함해도 자연스러움)
// - 1글자 한글 bypass 방어 (예: `ㄱ AddThing` → 차단)
// - 한글 없음/1글자인데 영어 포함 → 첫 알파벳 lower-case 강제
// - 이모지/숫자만 있는 subject → 통과 (검증할 대상 없음)
const koreanAwareSubjectCase = (parsed) => {
  const subject = parsed.subject || '';
  if (!subject) return [true];

  const hangulCount = (subject.match(/\p{Script=Hangul}/gu) || []).length;

  // 한글 2글자 이상 → 한국어 주체 판정, case 생략
  if (hangulCount >= 2) return [true];

  // 영어 지배적 → 첫 알파벳 lower-case 강제
  const firstAlpha = subject.match(/[A-Za-z]/);
  if (firstAlpha && firstAlpha[0] !== firstAlpha[0].toLowerCase()) {
    return [false, 'subject must be lower-case (require 2+ Hangul chars for Korean-mode bypass)'];
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
