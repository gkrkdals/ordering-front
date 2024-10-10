import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {RecentMenu} from "@src/models/client/RecentMenu.ts";

interface RecentOrdersProps {
  recentMenus: RecentMenu[];
}

export default function RecentOrders({ recentMenus }: RecentOrdersProps) {
  return (
    <>
      <p className='mt-5 mb-1' style={{fontSize: '1.4em'}}>
        최근주문메뉴
      </p>
      <Table>
        <TBody>
          {recentMenus.map(menu => (
            <TRow key={menu.id}>
              <Cell style={{backgroundColor: `#${menu.menuCategory?.hex}`}}>
                {menu.name}
              </Cell>
            </TRow>
          ))}
        </TBody>
      </Table>
    </>
  )
}