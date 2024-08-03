import Card from "@src/components/Card.tsx";
import {Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext} from "react";
import {MenuContext} from "@src/contexts/MenuContext.tsx";
import {makePair} from "@src/utils/data.ts";
import Menu from "@src/models/common/Menu.ts";
import MenuCell from "@src/pages/client/components/atoms/MenuCell.tsx";

interface MenuTableProps {
  onMenuClick?: (menu: Menu) => void;
}


export default function MenuTable({ onMenuClick }: MenuTableProps) {

  const [menus, ] = useContext(MenuContext);

  return (
    <Card style={{ height: '418px' }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <Table style={{ tableLayout: 'fixed' }}>
          <TBody>
            {makePair<Menu>(menus).map((menu, i) => {
              return (
                <TRow key={i}>
                  <MenuCell menu={menu[0]} onClick={() => onMenuClick(menu[0])} />
                  {menu[1] && <MenuCell menu={menu[1]} onClick={() => onMenuClick(menu[1])} />}
                </TRow>
              )
            })}
          </TBody>
        </Table>
      </div>
    </Card>
  )
}