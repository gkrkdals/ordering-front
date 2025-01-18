import {Cell, HeadCell, Sort, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import {ModifyCustomerModal} from "@src/pages/manager/modals/customer/ModifyCustomerModal.tsx";
import React, {useContext, useState} from "react";
import ModifyCustomerCredit from "@src/pages/manager/modals/customer/ModifyCustomerCredit.tsx";
import {Column} from "@src/models/manager/Column.ts";
import {CustomerRaw} from "@src/models/manager/CustomerRaw.ts";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";
import {formatCurrency} from "@src/utils/data.ts";

interface CustomerTableProps {
  columns: Column[];
  sort: Sort;
  setSort: (sort: Sort) => void;
  customers: CustomerRaw[];
  page: number;
  reload: () => void;
}

export default function CustomerTable(props: CustomerTableProps) {
  const [open, setOpen] = useState(false);
  const [openCredit, setOpenCredit] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRaw | null>(null);
  const [customerCategory] = useContext(CustomerCategoryContext)!

  function handleClickOnMenu(customer: CustomerRaw) {
    setSelectedCustomer(customer);
    setOpen(true);
  }

  function handleClickOnCredit(
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    customer: CustomerRaw
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
            {props.columns.map((column, i) =>
              <HeadCell sort={props.sort} setSort={props.setSort} focusIndex={i} key={i}>{column.name}</HeadCell>
            )}
          </TRow>
        </THead>
        <TBody>
          {props.customers.map((customer, i) => {
            return (
              <TRow key={i} onClick={() => handleClickOnMenu(customer)} style={{cursor:'pointer'}}>
                <Cell style={{ width: 50 }}>{(props.page - 1) * 20 + i + 1}</Cell>
                <Cell
                  style={{ backgroundColor: `#${customerCategory.find(category => category.id === customer.category)?.hex}`}}
                >
                  {customer.name}
                </Cell>
                <Cell>{customer.address}</Cell>
                <Cell>{customer.tel}</Cell>
                <Cell>{customer.floor}</Cell>
                <Cell>{customer.memo}</Cell>
                <Cell
                  onClick={e => handleClickOnCredit(e, customer)}
                >
                  {formatCurrency(customer.credit * -1, true)}
                </Cell>
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
        customerName={selectedCustomer?.name}
        open={openCredit}
        setOpen={setOpenCredit}
        reload={props.reload}
      />
    </>
  )
}