import client from "@src/utils/network/client.ts";
import {useEffect, useMemo, useState} from "react";
import Order from "@src/models/common/Order.ts";
import Card from "@src/components/Card.tsx";
import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import MenuCell from "@src/pages/client/components/atoms/MenuCell.tsx";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import Menu from "@src/models/common/Menu.ts";
import {makePair} from "@src/utils/data.ts";

interface MenuTableProps {
  onMenuClick: (menu: Menu) => void;
}

export default function RecentMenuTable({ onMenuClick } : MenuTableProps) {
  const [lastOrders, setLastOrders] = useState<Order[]>([]);
  const customer = useRecoilValue(customerState);
  const menus = useMemo(() => lastOrders.map(order => order.menuJoin), [lastOrders]);

  useEffect(() => {
    client
      .get('/api/order/last')
      .then(res => setLastOrders(res.data))
  }, [open]);

  return menus.length > 0 && (
    <Card>
      <Table style={{ tableLayout: 'fixed' }} tablesize='small'>
        <TBody >
          {makePair<Menu>(menus).map((menu, i) => {
            return (
              <TRow key={i}>
                <MenuCell menu={menu[0]} onClick={() => onMenuClick(menu[0])} showPrice={customer?.showPrice} />
                {menu[1] ?
                  <MenuCell menu={menu[1]} onClick={() => onMenuClick(menu[1])} showPrice={customer?.showPrice} />
                  :
                  <Cell />
                }
              </TRow>
            )
          })}
        </TBody>
      </Table>
    </Card>
  )
}