/** 주문 수정 화면에서 기존 값을 불러오기 위한 상세 정보 (GET /api/manager/order/detail) */
export interface OrderDetail {
  orderCode: number;
  menu: number;
  menuName: string;
  /** 원 단위 */
  price: number;
  request: string;
}
