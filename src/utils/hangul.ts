/**
 * 초성 검색 유틸.
 *
 * 한글 음절은 `코드 = 0xAC00 + (초성×21 + 중성)×28 + 종성` 이므로
 * 같은 초성을 가진 음절이 588자씩 연속 블록을 이룬다. (ㄱ → 가~깋, ㅁ → 마~밓)
 * 따라서 검색어의 자모를 문자 범위로 바꾼 정규식을 만들면 초성 검색이 된다.
 *
 * 서버에도 같은 내용의 파일이 있다 (back/src/utils/hangul.ts).
 */

/** 초성이 될 수 있는 자모 19자 (ㄳ·ㄵ 등 종성 전용 겹자음은 제외) */
const CHOSUNG = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];

const HANGUL_BASE = 0xAC00;
const SYLLABLES_PER_CHOSUNG = 588;

const REGEX_META = /[.*+?^${}()|[\]\\]/g;

/** 검색어에 초성 자모가 섞여 있는지 여부 */
export function hasJamo(query: string): boolean {
  return [...query].some(char => CHOSUNG.includes(char));
}

/**
 * 검색어를 정규식 패턴 문자열로 변환합니다.
 *
 * 자모는 해당 초성의 음절 범위로, 나머지 문자는 리터럴(메타문자 이스케이프)로 바꾸고
 * 글자 사이에 `\s*`를 넣어 띄어쓰기를 무시한 매칭이 되게 합니다.
 */
export function toSearchPattern(query: string): string {
  return [...query]
    .filter(char => !/\s/.test(char))
    .map(toToken)
    .join('\\s*');
}

function toToken(char: string): string {
  const index = CHOSUNG.indexOf(char);

  if (index < 0) {
    return char.replace(REGEX_META, '\\$&');
  }

  const start = HANGUL_BASE + index * SYLLABLES_PER_CHOSUNG;
  return `[${String.fromCharCode(start)}-${String.fromCharCode(start + SYLLABLES_PER_CHOSUNG - 1)}]`;
}

/**
 * 검색어가 대상 문자열과 맞는지 검사합니다.
 *
 * 초성(ㅈㅇㄷㅂ)·완성형(제육 덮밥)·혼합(제육ㄷㅂ) 입력을 모두 지원하며,
 * 검색어가 비어 있으면 항상 참입니다.
 */
export function matchesSearch(text: string | undefined | null, query: string): boolean {
  const pattern = toSearchPattern(query);

  if (pattern.length === 0) {
    return true;
  }

  return new RegExp(pattern).test(text ?? '');
}
