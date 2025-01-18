import CustomerTable from "@src/pages/manager/components/molecules/CustomerTable.tsx";
import {useEffect, useState} from "react";
import MakeCustomerModal from "@src/pages/manager/modals/customer/MakeCustomerModal.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import TopBar from "@src/pages/manager/components/molecules/TopBar.tsx";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";
import {CustomerRaw} from "@src/models/manager/CustomerRaw.ts";

const columns: Column[] = [
  {key: '', name: '순번'},
  {key: 'name', name: '고객명'},
  {key: 'address', name: '주소'},
  {key: 'tel', name: '전화번호'},
  {key: 'floor', name: '층수'},
  {key: 'memo', name: '비고'},
  {key: 'credit', name: '잔금'},
];

export default function CustomerDisplay() {
  const [open, setOpen] = useState(false);
  const [sort, setSort, params] = useTableSort(columns);

  const {
    data,
    currentPage,
    totalPage,
    prev,
    next,
    reload,
    searchData,
    setSearchData,
  } = useTable<CustomerRaw>('/api/manager/customer', params);

  useEffect(() => {
    window.addEventListener('reload', reload);

    return () => {
      window.removeEventListener('reload', reload);
    }
  }, []);

  return (
    <>
      <div className='mb-2'/>
      <TopBar
        mode={'customer'}
        searchData={searchData}
        setSearchData={setSearchData}
        current={currentPage}
        total={totalPage}
        prev={prev}
        next={next}
        setOpen={setOpen}
      />
      <CustomerTable
        columns={columns}
        sort={sort}
        setSort={setSort}
        customers={data}
        page={currentPage}
        reload={reload}
      />

      <MakeCustomerModal reload={reload} open={open} setOpen={setOpen}/>
    </>
  );
}