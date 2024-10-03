export interface OrderStatusRaw {
  id: number;
  order_code: number;
  menu: number;
  menu_name: string;
  time: string;
  customer: number;
  customer_category: number;
  customer_name: string;
  customer_memo: string;
  request: string;
  status: number;
  status_name: string;
  price: number;
  credit: number
  address: string;
  floor: string;
  memo: string;
  location: string;
}