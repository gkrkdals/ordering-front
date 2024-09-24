import MenuTable from "@src/pages/manager/components/molecules/MenuTable.tsx";
import Menu from "@src/models/common/Menu.ts";
import {useState} from "react";
import MakeMenuModal from "@src/pages/manager/modals/menu/MakeMenuModal.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";

export default function MenuDisplay() {
  const [open, setOpen] = useState(false);

  const {
    data,
    currentPage,
    totalPage,
    prev,
    next,
    reload,
    searchData,
    setSearchData,
  } = useTable<Menu>('/api/manager/menu');

  return (
    <>
      <MenuTable
        menus={data}
        page={currentPage}
        reload={reload}
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