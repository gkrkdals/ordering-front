import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext, useEffect, useState} from "react";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {OrderSummaryContext} from "@src/contexts/client/OrderSummaryContext.tsx";
import client from "@src/utils/client.ts";
import {socket} from "@src/utils/socket.ts";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";

export default function OrderStatusCount() {

  const [orderCategories] = useContext(OrderCategoryContext)!;
  const [, setOrderSummaries] = useContext(OrderSummaryContext)!;
  const [orderSummaryCount, setOrderSummaryCount] = useState<{ status: number, count: number }[]>([])

  useEffect(() => {
    function cleanup() {
      socket.removeAllListeners();
      socket.disconnect();
    }
    socket.connect();

    window.addEventListener('beforeunload', cleanup);

    socket.on('refresh_client', async () => {
      const res = await client.get('/api/order/summary');
      setOrderSummaries(res.data.map(((summary: any) => {
        return ({
          ...summary,
          statusName: summary['status_name'],
          menuName: summary['menu_name']
        });
      })));

      const res2 = await client.get('/api/order/summary/count');
      setOrderSummaryCount(res2.data);
    });

    client
      .get('/api/order/summary/count')
      .then(res => setOrderSummaryCount(res.data))

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);

  return (
    <Table tablesize='small' style={{ tableLayout: 'fixed', fontSize: '11pt' }}>
      <TBody>
        <TRow>
          {
            orderCategories
              .filter(category => category.status <= StatusEnum.InDelivery)
              .map((category) =>
                <Cell key={category.name} style={{ backgroundColor: `#${category.hex}`}}>{category.name}</Cell>
              )
          }
        </TRow>
        <TRow>
          {
            orderCategories
              .filter(category => category.status <= StatusEnum.InDelivery)
              .map((category, i) => {
                return (
                  <Cell key={i}>
                    {orderSummaryCount.find((order) => order.status === category.status)?.count ?? 0}건
                  </Cell>
                );
              })
          }
        </TRow>
      </TBody>
    </Table>
  );
}