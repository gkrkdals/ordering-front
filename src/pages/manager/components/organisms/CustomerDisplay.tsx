import CustomerTable from "@src/pages/manager/components/molecules/CustomerTable.tsx";
import {useState} from "react";
import MakeCustomerModal from "@src/pages/manager/modals/MakeCustomerModal.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import Customer from "@src/models/common/Customer.ts";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";

export default function CustomerDisplay() {
  const [open, setOpen] = useState(false);

  const [
    customers,
    current,
    total,
    prev,
    next,
    reload,
    searchData,
    setSearchData
  ] = useTable<Customer>('/api/manager/customer');

  return (
    <>
      <CustomerTable
        customers={customers}
        page={current}
        reload={reload}
      />
      <BottomBar
        mode={'customer'}
        searchData={searchData}
        setSearchData={setSearchData}
        current={current}
        total={total}
        prev={prev}
        next={next}
      />

      <MakeCustomerModal reload={reload} open={open} setOpen={setOpen} />
    </>
  );
}