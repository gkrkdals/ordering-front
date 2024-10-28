import OrderStatusCount from "@src/pages/client/components/molecules/OrderStatusCount.tsx";
import OrderDetail from "@src/pages/client/components/molecules/OrderDetail.tsx";
import DishDisposal from "@src/pages/client/components/molecules/DishDisposal.tsx";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";

export default function CurrentOrderStatus() {
  const customer = useRecoilValue(customerState);
  return (
    <div className='my-3'>
      {!(customer?.hideOrderStatus === 1) && <OrderStatusCount />}
      <OrderDetail />
      <DishDisposal />
    </div>
  )
}