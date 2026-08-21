import Customer from "@src/models/common/Customer.ts";
import {useState} from "react";
import SearchAutocomplete from "@src/components/molecules/SearchAutocomplete.tsx";

interface SelectCustomerProps {
  uniqueId: string;
  customers: Customer[];
  setSelectedCustomer: (selectedCustomer: number) => void;
}

export default function SelectCustomer(props: SelectCustomerProps) {
  const [selected, setSelected] = useState<Customer | null>(null);

  function handleSelect(customer: Customer | null) {
    setSelected(customer);

    if (customer) {
      props.setSelectedCustomer(customer.id);
    }
  }

  return (
    <SearchAutocomplete
      id={props.uniqueId}
      options={props.customers}
      getLabel={customer => customer.name}
      secondary={customer => customer.tel}
      value={selected}
      onSelect={handleSelect}
      placeholder='고객 선택'
    />
  );
}
