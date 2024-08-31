import {OrderSummary} from "@src/models/client/OrderSummary.ts";
import React, {createContext, useEffect, useState} from "react";
import client from "@src/utils/client.ts";

type OrderSummaryContextProps = [OrderSummary[],  React.Dispatch<React.SetStateAction<OrderSummary[]>>];

export const OrderSummaryContext = createContext<OrderSummaryContextProps | null>(null);

const OrderSummaryProvider = ({ children }: { children?: React.ReactNode }) => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary[]>([]);

  useEffect(() => {
    client
      .get('/api/order/summary')
      .then(res => {
        setOrderSummary(res.data.map(((summary: any) => {
          return ({
            ...summary,
            statusName: summary['status_name'],
            menuName: summary['menu_name']
          });
        })));
      });
  }, []);

  return (
    <OrderSummaryContext.Provider value={[orderSummary, setOrderSummary]}>
      {children}
    </OrderSummaryContext.Provider>
  )
};

export default OrderSummaryProvider;