export interface CustomerRaw {
  id: number;
  name: string;
  address: string;
  tel: string;
  memo: string;
  floor: string;
  category: number;
  withdrawn: number;
  credit: number;
  /** 그룹 미지정이면 -1 (목록 SQL이 IFNULL로 채워준다) */
  discount_group_id: number;
  discount_name: string;
  reward_per_menu: number;
  reward_per_bowl: number;
  point_balance: number;
  is_sold_out: number;
}