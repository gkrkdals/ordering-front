import Customer from "@src/models/common/Customer.ts";
import Menu from "@src/models/common/Menu.ts";

export default interface Order {
  id: number;
  customer: string;
  customerJoin: Customer;
  menu: number;
  menuJoin: Menu;
  done: number;
  time: string;
  request: string | null;
  memo: string | null;
  price: number;
}