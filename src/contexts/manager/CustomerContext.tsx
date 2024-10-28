import Customer from "@src/models/common/Customer.ts";
import React, {createContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";

export type CustomerContextProps = [Customer[], React.Dispatch<React.SetStateAction<Customer[]>>];

export const CustomerContext = createContext<CustomerContextProps | null>(null);

const CustomerProvider = ({ children }: { children?: React.ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  function reload() {
    client
      .get('/api/manager/customer/all')
      .then((res) => setCustomers(res.data));
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <CustomerContext.Provider value={[customers, setCustomers]}>
      {children}
    </CustomerContext.Provider>
  )
}

export default CustomerProvider;