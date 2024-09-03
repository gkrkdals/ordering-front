import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import Customer from "@src/models/common/Customer.ts";
import {ModifyCustomerModal} from "@src/pages/manager/modals/ModifyCustomerModal.tsx";
import {useState} from "react";

interface CustomerTableProps {
  customers: Customer[];
  page: number;
  reload: () => void;
}

const columns = [
  '순번',
  '고객명',
  '주소',
  '비고',
]

export default function CustomerTable(props: CustomerTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  function handleClickOnMenu(customer: Customer) {
    setSelectedCustomer(customer);
    setOpen(true);
  }

  return (
    <>
      <Table tablesize='small' style={{ fontSize: '12pt' }}>
        <THead>
          <TRow>
            {columns.map((column, i) => (<Cell key={i}>{column}</Cell>))}
          </TRow>
        </THead>
        <TBody>
          {props.customers.map((customer, i) => {
            return (
              <TRow key={i} onClick={() => handleClickOnMenu(customer)} style={{cursor:'pointer'}}>
                <Cell>{(props.page - 1) * 20 + i + 1}</Cell>
                <Cell style={{ backgroundColor: `#${customer.categoryJoin?.hex}` }}>{customer.name}</Cell>
                <Cell>{customer.address}</Cell>
                <Cell>{customer.memo}</Cell>
              </TRow>
            );
          })}
        </TBody>
      </Table>

      <ModifyCustomerModal
        currentCustomer={selectedCustomer}
        reload={props.reload}
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}