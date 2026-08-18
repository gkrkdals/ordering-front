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
  discount_group_id: string;
  discount_name: string;
  reward_per_menu: number;
  reward_per_bowl: number;
  point_balance: number;
  is_sold_out: number;
}