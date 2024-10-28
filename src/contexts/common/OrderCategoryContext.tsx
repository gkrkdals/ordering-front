import OrderCategory from "@src/models/common/OrderCategory.ts";
import React, {createContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";

type OrderCategoryContextProps = [OrderCategory[], React.Dispatch<React.SetStateAction<OrderCategory[]>>];

export const OrderCategoryContext = createContext<OrderCategoryContextProps | null>(null);

const OrderCategoryProvider = ({ children }: { children: React.ReactNode }) => {

  const [orderCategories, setOrderCategories] = useState<OrderCategory[]>([]);

  useEffect(() => {
    client.get('/api/manager/order/category')
      .then((res) => setOrderCategories(res.data));
  }, []);

  return (
    <OrderCategoryContext.Provider value={[orderCategories, setOrderCategories]}>
      {children}
    </OrderCategoryContext.Provider>
  )
}

export default OrderCategoryProvider;