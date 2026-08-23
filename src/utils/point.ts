/**
 * 적립금 단위 변환.
 *
 * 적립금은 DB·API에서 **백원 단위**로 다뤄지지만(`point_history.amount`,
 * `customer.point_balance`, `reward_per_menu` 등), 관리자 화면에서는 다른 금액 항목과
 * 헷갈리지 않도록 **원 단위**로 입력·표시한다. 그 경계 변환을 여기 모아둔다.
 *
 * 저장 단위가 백원이므로 입력값은 100원 단위여야 한다.
 */

/** 적립금 1 = 100원 */
export const POINT_UNIT = 100;

export const POINT_UNIT_MESSAGE = `적립금은 ${POINT_UNIT}원 단위로 입력해주세요`;

/** 백원 단위 적립금 → 원 */
export function pointToWon(point: number | null | undefined): number {
  return (point ?? 0) * POINT_UNIT;
}

/** 백원 단위 적립금 → 입력창에 넣을 원 단위 문자열 (미설정이면 빈 문자열) */
export function pointToWonText(point: number | null | undefined): string {
  if (point === null || point === undefined) {
    return '';
  }

  return (point * POINT_UNIT).toString();
}

/**
 * 입력창의 원 단위 문자열 → 저장용 백원 단위 값.
 *
 * @returns 빈 문자열이면 null(미설정), 100원 단위가 아니거나 숫자가 아니면 undefined(오류)
 */
export function wonTextToPoint(wonText: string): number | null | undefined {
  const trimmed = wonText.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (!/^\d+$/.test(trimmed)) {
    return undefined;
  }

  const won = parseInt(trimmed);

  if (won % POINT_UNIT !== 0) {
    return undefined;
  }

  return won / POINT_UNIT;
}
