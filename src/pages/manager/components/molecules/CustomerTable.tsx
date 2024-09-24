import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import Customer from "@src/models/common/Customer.ts";
import {ModifyCustomerModal} from "@src/pages/manager/modals/customer/ModifyCustomerModal.tsx";
import React, {useState} from "react";
import ModifyCustomerCredit from "@src/pages/manager/modals/customer/ModifyCustomerCredit.tsx";

interface CustomerTableProps {
  customers: Customer[];
  page: number;
  reload: () => void;
}

const columns = [
  '순번',
  '고객명',
  '주소',
  '층수',
  '비고',
  '잔금',
]

export default function CustomerTable(props: CustomerTableProps) {
  const [open, setOpen] = useState(false);
  const [openCredit, setOpenCredit] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  function handleClickOnMenu(customer: Customer) {
    setSelectedCustomer(customer);
    setOpen(true);
  }

  function handleClickOnCredit(
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    customer: Customer
  ) {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setOpenCredit(true);
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
                <Cell style={{ width: 50 }}>{(props.page - 1) * 20 + i + 1}</Cell>
                <Cell style={{ backgroundColor: `#${customer.categoryJoin?.hex}` }}>{customer.name}</Cell>
                <Cell>{customer.address}</Cell>
                <Cell>{customer.floor}</Cell>
                <Cell>{customer.memo}</Cell>
                <Cell onClick={e => handleClickOnCredit(e, customer)}>{customer.credit.toLocaleString('ko-KR')}</Cell>
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

      <ModifyCustomerCredit
        customer={selectedCustomer?.id}
        open={openCredit}
        setOpen={setOpenCredit}
        reload={props.reload}
      />
    </>
  )
}