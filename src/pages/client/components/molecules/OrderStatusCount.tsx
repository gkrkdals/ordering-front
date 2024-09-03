import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext, useEffect} from "react";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {OrderSummaryContext} from "@src/contexts/client/OrderSummaryContext.tsx";
import {getSocket} from "@src/utils/socket.ts";
import client from "@src/utils/client.ts";

const socket = getSocket();

export default function OrderStatusCount() {

  const [orderCategories] = useContext(OrderCategoryContext)!;
  const [orderSummaries, setOrderSummaries] = useContext(OrderSummaryContext)!;

  useEffect(() => {
    function cleanup() {
      socket.removeAllListeners();
      socket.disconnect();
    }

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
    })

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);

  return (
    <Table tablesize='small' style={{ tableLayout: 'fixed', fontSize: '11pt' }}>
      <TBody>
        <TRow>
          {orderCategories.filter(category => category.status <= 4).map((category) => {
            return <Cell key={category.name}>{category.name}</Cell>
          })}
        </TRow>
        <TRow>
          {orderCategories.filter(category => category.status <= 4).map((category, i) => {
            return (
              <Cell key={i}>
                {orderSummaries.filter((order) => order.status === category.status).length}건
              </Cell>
            );
          })}
        </TRow>
      </TBody>
    </Table>
  );
}