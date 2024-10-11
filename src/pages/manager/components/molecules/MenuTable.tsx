import Menu from "@src/models/common/Menu.ts";
import {Cell, HeadCell, Sort, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import ModifyMenuModal from "@src/pages/manager/modals/menu/ModifyMenuModal.tsx";
import React, {useState} from "react";
import {Column} from "@src/models/manager/Column.ts";
import client from "@src/utils/client.ts";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import SetMenuShownOrder from "@src/pages/manager/modals/menu/SetMenuShownOrder.tsx";

interface MenuTableProps {
  columns: Column[];
  menus: Menu[];
  page: number;
  reload: () => void;
  sort: Sort;
  setSort: (sort: Sort) => void;
}

export default function MenuTable({columns, menus, page, reload, sort, setSort}: MenuTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [allSoldOut, setAllSoldOut] = useState(false);
  const [openMenuOrder, setOpenMenuOrder] = useState(false);

  function handleClickOnMenu(menu: Menu) {
    setSelectedMenu(menu);
    setOpen(true);
  }

  async function toggleSoldOutAll() {
    await client.put('/api/manager/menu/sold-out/all', {soldOut: !allSoldOut});
    setAllSoldOut(!allSoldOut);
    reload();
  }

  async function toggleSoldOut(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, menu: Menu) {
    e.stopPropagation();
    await client.put('/api/manager/menu/sold-out', {menu: menu.id, soldOut: menu.soldOut === 1});
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
              </TRow>
            );
          })}
        </TBody>
      </Table>
      <div className='mt-2' />
      <div className='d-flex gap-3'>
        <PrimaryButton onClick={toggleSoldOutAll}>
          전체 품절 전환
        </PrimaryButton>
        <PrimaryButton onClick={() => setOpenMenuOrder(true)}>
          메뉴 순서 설정
        </PrimaryButton>
      </div>

      <ModifyMenuModal
        currentMenu={selectedMenu}
        reload={reload}
        open={open}
        setOpen={setOpen}
      />

      <SetMenuShownOrder open={openMenuOrder} setOpen={setOpenMenuOrder} />
    </>
  )
}