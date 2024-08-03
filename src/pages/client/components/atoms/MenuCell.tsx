import Menu from "@src/models/common/Menu.ts";
import {Cell} from "@src/components/tables/Table.tsx";
import {MouseEventHandler} from "react";

interface MenuCellProps {
  menu: Menu;
  onClick?: MouseEventHandler;
}

export default function MenuCell({ menu, onClick }: MenuCellProps) {
  return (
    <Cell
      className='text-center'
      style={{ fontSize: '9pt', cursor: 'pointer' }}
      hex={menu.foodCategory.hex}
      onClick={onClick}
    >
      {menu.name}
    </Cell>
  )
}