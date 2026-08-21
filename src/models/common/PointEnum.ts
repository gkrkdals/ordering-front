/** 백엔드 point_history.path_type 값 */
export enum PointEnum {
  MENU = 'MENU',
  BOWL = 'BOWL',
  USE = 'USE',
  CANCELED = 'CANCELED',
  ADMIN_ADD = 'ADMIN_ADD',
  ADMIN_REMOVE = 'ADMIN_REMOVE',
}

/** 적립금 내역 화면에 보여줄 구분명 */
export const POINT_TYPE_LABEL: Record<string, string> = {
  [PointEnum.MENU]: '메뉴 적립',
  [PointEnum.BOWL]: '그릇수거 적립',
  [PointEnum.USE]: '적립금 사용',
  [PointEnum.CANCELED]: '사용 취소',
  [PointEnum.ADMIN_ADD]: '관리자 지급',
  [PointEnum.ADMIN_REMOVE]: '관리자 차감',
};

/** 회수된 적립을 표시할 때 쓰는 색 (고동색) */
export const POINT_CANCELED_COLOR = '#8B4513';

/** 백엔드 point_history 한 줄 */
export interface PointHistoryItem {
  id: number;
  pathType: string;
  /** 백원 단위 */
  amount: number;
  /** 1이면 회수된 적립 */
  isCanceled: number;
  description: string;
  /** 적립이 발생한 주문의 메뉴명 (주문이 삭제된 과거 이력은 null) */
  menuName?: string | null;
  createdAt: string;
}
