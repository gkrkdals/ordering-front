import MenuTable from "@src/pages/manager/components/molecules/MenuTable.tsx";
import Menu from "@src/models/common/Menu.ts";
import {useState} from "react";
import MakeMenuModal from "@src/pages/manager/modals/menu/MakeMenuModal.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";

const columns: Column[] = [
  {key: '', name: '순번'},
  {key: 'name', name: '이름'},
  {key: 'soldOut', name: '비고'},
];

export default function MenuDisplay() {
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
  } = useTable<Menu>('/api/manager/menu', params);

  return (
    <>
      <MenuTable
        columns={columns}
        menus={data}
        page={currentPage}
        reload={reload}
        sort={sort}
        setSort={setSort}
      />
      <BottomBar
        mode={'menu'}
        setOpen={setOpen}
        searchData={searchData}
        setSearchData={setSearchData}
        current={currentPage}
        total={totalPage}
        prev={prev}
        next={next}
      />

      <MakeMenuModal open={open} setOpen={setOpen} reload={reload} />
    </>
  );
}