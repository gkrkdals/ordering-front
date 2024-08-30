import Menu from "@src/models/common/Menu.ts";
import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";

interface MenuTableProps {
  menus: Menu[];
  setselectedmenu: (menu: Menu) => void;
  page: number;
  setmodalopen: (open: boolean) => void;
  setisupdating: (updating: boolean) => void;
}

const columns = [
  '순번',
  '이름',
  '카테고리'
]

export default function MenuTable({menus, page, setselectedmenu, setmodalopen, setisupdating}: MenuTableProps) {



  function handleClickOnMenu(menu: Menu) {
    setselectedmenu(menu);
    setisupdating(true);
    setmodalopen(true);
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
              <TRow key={i} style={{ cursor: 'pointer' }} onClick={() => handleClickOnMenu(menus[i])}>
                <Cell>{(page - 1) * 20 + i + 1}</Cell>
                <Cell>{menu.name}</Cell>
                <Cell style={{ backgroundColor: `#${menu.menuCategory?.hex}` }}>
                  {menu.menuCategory?.name}({menu.menuCategory?.price}원)
                </Cell>
              </TRow>
            );
          })}
        </TBody>
      </Table>
    </>
  )
}