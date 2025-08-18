import Menu from "@src/models/common/Menu.ts";
import {Cell} from "@src/components/tables/Table.tsx";
import {MouseEventHandler} from "react";
import {formatCurrency} from "@src/utils/data.ts";

interface MenuCellProps {
  menu: Menu;
  onClick?: MouseEventHandler;
  showPrice?: number;
}

export default function MenuCell({ menu, onClick, showPrice }: MenuCellProps) {
  return (
    <Cell
      className='text-center'
      style={{ fontSize: '12pt', cursor: 'pointer' }}
      hex={menu.soldOut === 1 ? 'AAAAAA' : menu.menuCategory?.hex}
      onClick={onClick}
    >
      {menu.name}
      {showPrice === 1 && (
        <>
          <br/>
          <p className='m-0' style={{ fontSize: '0.9em'}}>
            {formatCurrency(menu.menuCategory?.price)}

          </p>
        </>
      )}
      {menu.soldOut === 1 && <p className='m-0 text-danger'>품절</p>}
    </Cell>
  )
}