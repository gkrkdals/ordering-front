import MenuTable from "@src/pages/manager/components/molecules/MenuTable.tsx";
import Menu from "@src/models/common/Menu.ts";
import {useEffect, useState} from "react";
import MakeMenuModal from "@src/pages/manager/modals/menu/MakeMenuModal.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import BottomBar from "@src/pages/manager/components/molecules/BottomBar.tsx";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";
import Pagination from "@src/pages/manager/components/atoms/Pagination.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import SetMenuShownOrder from "@src/pages/manager/modals/menu/SetMenuShownOrder.tsx";
import client from "@src/utils/client.ts";

const columns: Column[] = [
  {key: '', name: '순번'},
  {key: 'name', name: '이름'},
  {key: 'soldOut', name: '비고'},
];

export default function MenuDisplay() {
  const [open, setOpen] = useState(false);
  const [allSoldOut, setAllSoldOut] = useState(false);
  const [openMenuOrder, setOpenMenuOrder] = useState(false);

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

  useEffect(() => {
    window.addEventListener('reload', reload);

    return () => {
      window.removeEventListener('reload', reload);
    }
  }, []);

  async function toggleSoldOutAll() {
    await client.put('/api/manager/menu/sold-out/all', {soldOut: !allSoldOut});
    setAllSoldOut(!allSoldOut);
    await reload();
  }

  return (
    <>
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
      <MenuTable
        columns={columns}
        menus={data}
        page={currentPage}
        reload={reload}
        sort={sort}
        setSort={setSort}
      />
      <div className='d-sm-flex justify-content-between'>
        <div className='d-flex gap-3'>
          <PrimaryButton onClick={toggleSoldOutAll}>
            전체 품절 전환
          </PrimaryButton>
          <PrimaryButton onClick={() => setOpenMenuOrder(true)}>
            메뉴 순서 설정
          </PrimaryButton>
        </div>

        <div className='d-flex d-sm-block justify-content-end justify-content-sm-start'>
          <Pagination
            currentpage={currentPage}
            totalpage={totalPage}
            onclickleft={prev}
            onclickright={next}
          />
        </div>
      </div>


      <MakeMenuModal open={open} setOpen={setOpen} reload={reload}/>

      <SetMenuShownOrder open={openMenuOrder} setOpen={setOpenMenuOrder}/>
    </>
  );
}