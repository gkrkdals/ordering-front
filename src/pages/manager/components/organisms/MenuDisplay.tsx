import MenuTable from "@src/pages/manager/components/molecules/MenuTable.tsx";
import Menu from "@src/models/common/Menu.ts";
import {useEffect, useMemo, useState} from "react";
import MakeMenuModal from "@src/pages/manager/modals/menu/MakeMenuModal.tsx";
import useTable from "@src/hooks/UseTable.tsx";
import TopBar from "@src/pages/manager/components/molecules/TopBar.tsx";
import {Column} from "@src/models/manager/Column.ts";
import {useTableSort} from "@src/hooks/UseTableSort.tsx";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import SetMenuShownOrder from "@src/pages/manager/modals/menu/SetMenuShownOrder.tsx";
import client from "@src/utils/network/client.ts";
import GroupSelect, {GLOBAL_GROUP_ID} from "@src/pages/manager/components/molecules/GroupSelect.tsx";

const columns: Column[] = [
  {key: '', name: '순번'},
  {key: 'name', name: '이름'},
  {key: 'soldOut', name: '비고'},
  {key: 'isRewardable', name: '적립여부'}
];

export default function MenuDisplay() {
  const [open, setOpen] = useState(false);
  const [allSoldOut, setAllSoldOut] = useState(false);
  const [openMenuOrder, setOpenMenuOrder] = useState(false);

  const [sort, setSort, sortParams] = useTableSort(columns);
  // 고른 그룹의 품절 상태로 목록을 본다 (전체 공통이면 menu.sold_out)
  const [groupId, setGroupId] = useState<number>(GLOBAL_GROUP_ID);
  const params = useMemo(() => ({ ...sortParams, groupId }), [sortParams, groupId]);

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
    await client.put('/api/manager/menu/sold-out/all', {soldOut: !allSoldOut, groupId});
    setAllSoldOut(!allSoldOut);
    await reload();
  }

  return (
    <>
      <TopBar
        mode={'menu'}
        setOpen={setOpen}
        searchData={searchData}
        setSearchData={setSearchData}
        current={currentPage}
        total={totalPage}
        prev={prev}
        next={next}
      />
      <div className='my-2' style={{ maxWidth: 260 }}>
        <GroupSelect value={groupId} onChange={setGroupId} />
      </div>
      <MenuTable
        columns={columns}
        menus={data}
        page={currentPage}
        reload={reload}
        sort={sort}
        setSort={setSort}
        groupId={groupId}
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
      </div>


      <MakeMenuModal open={open} setOpen={setOpen} reload={reload}/>

      <SetMenuShownOrder open={openMenuOrder} setOpen={setOpenMenuOrder}/>
    </>
  );
}