export interface OrderStatusRaw {
  id: number;
  order_code: number;
  menu: number;
  menu_name: string;
  time: string;
  customer: number;
  customer_name: string;
  request: string;
  status: number;
  status_name: string;
  credit: number
  floor: string;
  memo: string;
}