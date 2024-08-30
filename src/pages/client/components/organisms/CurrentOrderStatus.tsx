import OrderStatusCount from "@src/pages/client/components/molecules/OrderStatusCount.tsx";
import OrderDetail from "@src/pages/client/components/molecules/OrderDetail.tsx";
import DishDisposal from "@src/pages/client/components/molecules/DishDisposal.tsx";

export default function CurrentOrderStatus() {

  return (
    <div className='my-3'>
      <OrderStatusCount />
      <OrderDetail />
      <DishDisposal />
    </div>
  )
}