import Order from "@src/models/common/Order.ts";
import React, {createContext, useEffect, useState} from "react";

type OrderContextProps = [Order[], React.Dispatch<React.SetStateAction<Order[]>>];

export const OrderContext = createContext<OrderContextProps | null>(null);

const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    console.log(orders);
  }, [orders.length]);

  return(
    <OrderContext.Provider value={[orders, setOrders]}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderProvider;