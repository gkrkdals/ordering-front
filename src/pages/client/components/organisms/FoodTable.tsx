import Card from "@src/components/Card.tsx";
import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext, useEffect, useMemo, useState} from "react";
import {MenuContext} from "@src/contexts/client/MenuContext.tsx";
import {makePair} from "@src/utils/data.ts";
import Menu from "@src/models/common/Menu.ts";
import MenuCell from "@src/pages/client/components/atoms/MenuCell.tsx";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import client from "@src/utils/network/client.ts";

interface MenuTableProps {
  onMenuClick: (menu: Menu) => void;
}

export default function MenuTable({ onMenuClick }: MenuTableProps) {

  const [menus, ] = useContext(MenuContext)!;
  const customer = useRecoilValue(customerState);

  const [lastOrders, setLastOrders] = useState<Menu[]>([]);
  const menusWithRecents = useMemo(() => {
    const tmp = Array.from(menus);

    for (const lastMenu of lastOrders) {
      const index = tmp.findIndex((m) => m.id === lastMenu.id);
      if (index !== -1) {
        tmp.splice(index, 1);
      }
    }

    return lastOrders.concat(tmp);
  }, [menus, lastOrders]);

  const getLastOrders = async () => {
    const res = await client.get('/api/order/last');
    setLastOrders(res.data);
  };

  useEffect(() => {
    getLastOrders().then();
  }, [open]);

  useEffect(() => {
    window.addEventListener('reloadLast', getLastOrders)

    return () => {
      window.removeEventListener('reloadLast', getLastOrders);
    }
  }, []);

  return (
    <Card style={{ height: '55vh' }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <Table style={{ tableLayout: 'fixed' }}>
          <TBody>
            {makePair<Menu>(menusWithRecents).map((menu, i) => {
              return (
                <TRow key={i}>
                  <MenuCell menu={menu[0]} onClick={() => onMenuClick(menu[0])} showPrice={customer?.showPrice} />
                  {menu[1]
                    ?
                    <MenuCell menu={menu[1]} onClick={() => onMenuClick(menu[1])} showPrice={customer?.showPrice} />
                    :
                    <Cell />
                  }
                </TRow>
              )
            })}
          </TBody>
        </Table>
      </div>
    </Card>
  )
}