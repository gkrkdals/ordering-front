import Order from "@src/models/common/Order.ts";
import OrderCategory from "@src/models/common/OrderCategory.ts";

export default interface OrderStatus {
  id: number;
  orderCode: number;
  orderJoin: Order;
  status: number;
  statusJoin: OrderCategory;
  time: string;
}