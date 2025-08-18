// import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {RecentMenu} from "@src/models/client/RecentMenu.ts";
import {useEffect, useState} from "react";
import Order from "@src/models/common/Order.ts";
import client from "@src/utils/network/client.ts";
import {dateToString} from "@src/utils/date.ts";

interface RecentOrdersProps {
  recentMenus: RecentMenu[];
  open: boolean;
}

export default function RecentOrders({ open }: RecentOrdersProps) {
  const [lastOrders, setLastOrders] = useState<Order[]>([]);

  useEffect(() => {
    client
      .get('/api/order/last')
      .then(res => setLastOrders(res.data))
  }, [open]);

  return (
    <>
      <p className='mt-5 mb-1' style={{fontSize: '1.4em', fontWeight: 'bold'}}>
        최근주문내역
      </p>
      {/*<Table>*/}
      {/*  <TBody>*/}
      {/*    {recentMenus.map(menu => (*/}
      {/*      <TRow key={menu.id}>*/}
      {/*        <Cell style={{backgroundColor: `#${menu.menuCategory?.hex}`}}>*/}
      {/*          {menu.name}*/}
      {/*        </Cell>*/}
      {/*      </TRow>*/}
      {/*    ))}*/}
      {/*  </TBody>*/}
      {/*</Table>*/}
      {lastOrders.map((order, i) => (
        <div className='mb-2' key={i}>
          <div className='text-secondary'>{dateToString(new Date(order.time))}</div>
          <div>{order.menuJoin.name}{order.menu === 0 ? `(${order.request})` : ''}</div>
          {order.menu !== 0 ? <div>{order.request}</div> : null}
        </div>
      ))}
    </>
  )
}