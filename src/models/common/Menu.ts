import MenuCategory from "@src/models/common/MenuCategory.ts";
import {LAST_SEQ} from "@src/utils/data.ts";

export default interface Menu {
  id: number;
  name: string;
  category: number;
  soldOut: number;
  isDiscountable: number;
  isRewardable?: number;
  menuCategory?: MenuCategory;
  seq: number;
  /** 판매시간이 설정된 메뉴인지 (관리자 목록 표시용) */
  hasSchedule?: boolean;
}

export const defaultMenu: Menu = {
  id: 0,
  name: '',
  category: 1,
  soldOut: 0,
  seq: LAST_SEQ,
  isDiscountable: 1,
  isRewardable: 1
}
