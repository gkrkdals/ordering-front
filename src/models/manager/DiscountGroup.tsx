/**
 * 고객 그룹.
 *
 * 이름은 '할인 그룹'에서 출발했지만, 가격·적립 등 그룹 단위 설정 전반을 담는다.
 * 값이 비어 있는 설정은 고객 개별 값 → 전역 값 순으로 폴백된다.
 */
export interface DiscountGroup {
  id: number;
  name: string;
  discountType: 'amount' | 'percent';
  discountValue: number;
  description: string;
  /** 그룹 기본 메뉴 적립(백원). null이면 미설정 */
  rewardPerMenu: number | null;
  /** 그룹 기본 그릇수거 적립(백원). null이면 미설정 */
  rewardPerBowl: number | null;
}

export interface DiscountGroupExt extends DiscountGroup {
  modified: boolean;
  deleted: boolean;
}
