import Customer from "@src/models/common/Customer.ts";
import {useRef} from "react";
import FormControl from "@src/components/atoms/FormControl.tsx";

interface SelectCustomerProps {
  uniqueId: string;
  customers: Customer[];
  setSelectedCustomer: (selectedCustomer: number) => void;
}

export default function SelectCustomer(props: SelectCustomerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelectCustomer() {
    const value = inputRef.current!.value;
    const foundCustomer = props.customers.find(customer => customer.name === value);

    if (foundCustomer) {
      props.setSelectedCustomer(foundCustomer.id);
    }
  }

  return (
    <>
      <FormControl
        ref={inputRef}
        onInput={handleSelectCustomer}
        list={props.uniqueId}
        placeholder='고객 선택'
      />
      <datalist id={props.uniqueId}>
        {props.customers.map((customer, i) =>
          <option key={i} value={customer.name}>{customer.name}</option>
        )}
      </datalist>
    </>
  );
}