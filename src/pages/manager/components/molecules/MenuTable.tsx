import Menu from "@src/models/common/Menu.ts";
import {Cell, HeadCell, Sort, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import ModifyMenuModal from "@src/pages/manager/modals/menu/ModifyMenuModal.tsx";
import React, {useState} from "react";
import {Column} from "@src/models/manager/Column.ts";
import client from "@src/utils/network/client.ts";
import SetMenuShownOrder from "@src/pages/manager/modals/menu/SetMenuShownOrder.tsx";
import MenuScheduleModal from "@src/pages/manager/modals/menu/MenuScheduleModal.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";

interface MenuTableProps {
  columns: Column[];
  menus: Menu[];
  page: number;
  reload: () => void;
  sort: Sort;
  setSort: (sort: Sort) => void;
  /** 품절을 적용할 고객 그룹. 0이면 전체 공통(menu.sold_out) */
  groupId?: number;
  groupName?: string;
}

export default function MenuTable({columns, menus, page, reload, sort, setSort, groupId, groupName}: MenuTableProps) {
  const [openSchedule, setOpenSchedule] = useState(false);
  const [scheduleMenu, setScheduleMenu] = useState<Menu | null>(null);

  function handleOpenSchedule(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, menu: Menu) {
    // 행 클릭(메뉴 수정)으로 번지지 않게 막는다
    e.stopPropagation();
    setScheduleMenu(menu);
    setOpenSchedule(true);
  }
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [openMenuOrder, setOpenMenuOrder] = useState(false);

  function handleClickOnMenu(menu: Menu) {
    setSelectedMenu(menu);
    setOpen(true);
  }


  async function toggleSoldOut(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, menu: Menu) {
    e.stopPropagation();
    await client.put('/api/manager/menu/sold-out', {menu: menu.id, soldOut: menu.soldOut === 1, groupId});
    reload();
  }

  return (
    <>
      <Table tablesize='small' style={{ fontSize: '12pt' }}>
        <THead>
          <TRow>
            {columns.map((column, i) =>
              <HeadCell focusIndex={i} sort={sort} setSort={setSort} key={i}>{column.name}</HeadCell>
            )}
          </TRow>
        </THead>
        <TBody>
          {menus.map((menu, i) => {
            return (
              <TRow key={i} style={{ cursor: 'pointer' }} onClick={() => handleClickOnMenu(menu)}>
                <Cell style={{ width: 50 }}>{(page - 1) * 20 + i + 1}</Cell>
                <Cell style={{ backgroundColor: `#${menu.menuCategory?.hex}` }}>{menu.name}</Cell>
                <Cell onClick={e => toggleSoldOut(e, menu)}>
                  {menu.soldOut ? '품절' : ''}
                </Cell>
                <Cell style={{ width: 100}}>
                  {(menu.isRewardable ?? 1) === 1 ? '가능' : '불가능'}
                </Cell>
                <Cell style={{ width: 110 }} onClick={e => handleOpenSchedule(e, menu)}>
                  {/* 시간 제약이 걸린 메뉴는 색을 채워 구분한다 — 품절 칸은 수동 상태만 보여주기 때문 */}
                  {menu.hasSchedule ? (
                    <PrimaryButton small style={{ whiteSpace: 'nowrap' }}>
                      판매시간
                    </PrimaryButton>
                  ) : (
                    <SecondaryButton small style={{ whiteSpace: 'nowrap' }}>
                      판매시간
                    </SecondaryButton>
                  )}
                </Cell>
              </TRow>
            );
          })}
        </TBody>
      </Table>
      <div className='mt-2' />

      <ModifyMenuModal
        currentMenu={selectedMenu}
        reload={reload}
        open={open}
        setOpen={setOpen}
      />

      <SetMenuShownOrder open={openMenuOrder} setOpen={setOpenMenuOrder} />

      <MenuScheduleModal
        open={openSchedule}
        setOpen={setOpenSchedule}
        menu={scheduleMenu}
        groupId={groupId ?? 0}
        groupName={groupName ?? '전체 공통'}
      />
    </>
  )
}