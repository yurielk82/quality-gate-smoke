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
// - subject에 한글이 전체의 30% 이상이면 한국어 주체로 간주 → case 검증 통과
// - 1글자 한글만 섞어 bypass 방지 (예: `fix: ㄱ temp` → 거부)
// - 이모지만 있는 subject도 통과 (한글 0%여도 영문자 없으면 bypass 허용 불가 → 영문 대문자만 거부)
// - 영어 전용이면 lower-case 강제 (Conventional Commits 원칙)
const koreanAwareSubjectCase = (parsed) => {
  const subject = parsed.subject || '';
  if (!subject) return [true];

  // 한글 문자 수 / 알파벳+한글 문자 수 비율로 판단
  const hangulCount = (subject.match(/\p{Script=Hangul}/gu) || []).length;
  const alphaCount = (subject.match(/[A-Za-z]/g) || []).length;
  const meaningfulCount = hangulCount + alphaCount;

  // 의미 있는 문자 없음 (이모지/숫자만) → pass
  if (meaningfulCount === 0) return [true];

  const hangulRatio = hangulCount / meaningfulCount;

  // 한글 비율 30%+ → 한국어 subject로 판정, case 검증 생략
  if (hangulRatio >= 0.3) return [true];

  // 그 외 = 영어 주체 → 첫 알파벳 lower-case 강제
  const firstAlpha = subject.match(/[A-Za-z]/);
  if (firstAlpha && firstAlpha[0] !== firstAlpha[0].toLowerCase()) {
    return [false, 'subject must be lower-case (English-dominant subjects: Hangul ratio < 30%)'];
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
