import React, {createContext, useEffect, useState} from "react";
import {CustomerCategory} from "@src/models/common/CustomerCategory.ts";
import client from "@src/utils/network/client.ts";

export type CustomerCategoryContextProps = [CustomerCategory[], React.Dispatch<React.SetStateAction<CustomerCategory[]>>];

export const CustomerCategoryContext = createContext<CustomerCategoryContextProps | null>(null);

const CustomerCategoryProvider = ({ children }: { children?: React.ReactNode }) => {
  const [customerCategories, setCustomerCategories] = useState<CustomerCategory[]>([]);

  useEffect(() => {
    client
      .get('/api/manager/customer/category')
      .then((res) => setCustomerCategories(res.data));
  }, []);

  return (
    <CustomerCategoryContext.Provider value={[customerCategories, setCustomerCategories]}>
      {children}
    </CustomerCategoryContext.Provider>
  );
}

export default CustomerCategoryProvider;