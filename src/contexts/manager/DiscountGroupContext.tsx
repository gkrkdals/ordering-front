import {DiscountGroup} from "@src/models/manager/DiscountGroup.tsx";
import React, {createContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";

export type DiscountGroupContextProps = [DiscountGroup[], React.Dispatch<React.SetStateAction<DiscountGroup[]>>];

export const DiscountGroupContext = createContext<DiscountGroupContextProps | null>(null);

const DiscountGroupProvider = ({ children }: { children?: React.ReactNode }) => {
  const [discountGroups, setDiscountGroups] = useState<DiscountGroup[]>([]);

  useEffect(() => {
    client
      .get('/api/manager/customer/discount-group')
      .then(res => setDiscountGroups(res.data));
  }, []);

  return (
    <DiscountGroupContext.Provider value={[discountGroups, setDiscountGroups]}>
      {children}
    </DiscountGroupContext.Provider>
  )
};

export default DiscountGroupProvider;