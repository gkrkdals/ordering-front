import CustomerTable from "@src/pages/manager/components/molecules/CustomerTable.tsx";
import {useState} from "react";
import MakeCustomerModal from "@src/pages/manager/modals/customer/MakeCustomerModal.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import Customer from "@src/models/common/Customer.ts";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";

export default function CustomerDisplay() {
  const [open, setOpen] = useState(false);

  const {
    data,
    currentPage,
    totalPage,
    prev,
    next,
    reload,
    searchData,
    setSearchData
  } = useTable<Customer>('/api/manager/customer');

  return (
    <>
      <div className='mb-2' />
      <CustomerTable
        customers={data}
        page={currentPage}
        reload={reload}
      />
      <BottomBar
        mode={'customer'}
        searchData={searchData}
        setSearchData={setSearchData}
        current={currentPage}
        total={totalPage}
        prev={prev}
        next={next}
        setOpen={setOpen}
      />

      <MakeCustomerModal reload={reload} open={open} setOpen={setOpen}/>
    </>
  );
}