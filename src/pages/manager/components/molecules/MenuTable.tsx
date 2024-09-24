import Menu from "@src/models/common/Menu.ts";
import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import ModifyMenuModal from "@src/pages/manager/modals/menu/ModifyMenuModal.tsx";
import {useState} from "react";

interface MenuTableProps {
  menus: Menu[];
  page: number;
  reload: () => void;
}

const columns = [
  '순번',
  '이름',
  '비고'
]

export default function MenuTable({menus, page, reload}: MenuTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  function handleClickOnMenu(menu: Menu) {
    setSelectedMenu(menu);
    setOpen(true);
  }

  return (
    <>
      <Table tablesize='small' style={{ fontSize: '12pt' }}>
        <THead>
          <TRow>
            {columns.map((column, i) => <Cell key={i}>{column}</Cell>)}
          </TRow>
        </THead>
        <TBody>
          {menus.map((menu, i) => {
            return (
              <TRow key={i} style={{ cursor: 'pointer' }} onClick={() => handleClickOnMenu(menu)}>
                <Cell style={{ width: 50 }}>{(page - 1) * 20 + i + 1}</Cell>
                <Cell style={{ backgroundColor: `#${menu.menuCategory?.hex}` }}>{menu.name}</Cell>
                <Cell>{menu.soldOut ? '품절' : ''}</Cell>
              </TRow>
            );
          })}
        </TBody>
      </Table>

      <ModifyMenuModal
        currentMenu={selectedMenu}
        reload={reload}
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}