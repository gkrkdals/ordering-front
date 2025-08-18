import OrderStatusCount from "@src/pages/client/components/molecules/OrderStatusCount.tsx";
import OrderDetail from "@src/pages/client/components/molecules/OrderDetail.tsx";
import DishDisposal from "@src/pages/client/components/molecules/DishDisposal.tsx";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import {useContext, useEffect, useState} from "react";
import {onDisconnected, customerSocket} from "@src/utils/network/socket.ts";
import client from "@src/utils/network/client.ts";
import {OrderSummaryContext} from "@src/contexts/client/OrderSummaryContext.tsx";
import {Disposal} from "@src/models/client/Disposal.ts";

export default function CurrentOrderStatus() {
  
  const [orderSummaryCount, setOrderSummaryCount] = useState<{ status: number, count: number }[]>([])
  const [, setOrderSummaries] = useContext(OrderSummaryContext)!;

  const [dishDisposals, setDishDisposals] = useState<Disposal[]>([]);
  const customer = useRecoilValue(customerState);

  function getOrderSummary() {
    client
      .get('/api/order/summary')
      .then((res) => {
        setOrderSummaries(res.data.map((summary: any) => {
          return ({
            ...summary,
            statusName: summary['status_name'],
            menuName: summary['menu_name']
          });
        }));
      })
  }

  function getOrderSummaryCount() {
    client
      .get('/api/order/summary/count')
      .then(res => setOrderSummaryCount(res.data))
  }

  function getDishDisposals() {
    client
      .get('/api/order/dish')
      .then((res) => setDishDisposals(res.data));
  }

  useEffect(() => {
    if(customer) {
      getDishDisposals();
    }
  }, [customer]);

  useEffect(() => {
    function cleanup() {
      customerSocket.removeAllListeners();
      customerSocket.disconnect();
    }
    customerSocket.connect();

    window.addEventListener('beforeunload', cleanup);

    customerSocket.on('ping', () => {
      customerSocket.emit('pong');
    });

    customerSocket.on('disconnect', () => onDisconnected(customerSocket));

    customerSocket.on('refresh_client', async () => {
      getOrderSummary();
      getOrderSummaryCount();
      getDishDisposals();
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
    <div className='my-3'>
      {!(customer?.hideOrderStatus === 1) && <OrderStatusCount orderSummaryCount={orderSummaryCount} />}
      <OrderDetail />
      <DishDisposal dishDisposals={dishDisposals} reloadDishDisposals={getDishDisposals} />
    </div>
  )
}