import OrderSummary from "@src/pages/client/components/molecules/OrderSummary.tsx";
import OrderDetail from "@src/pages/client/components/molecules/OrderDetail.tsx";
import DishCollection from "@src/pages/client/components/molecules/DishCollection.tsx";

export default function CurrentOrderStatus() {
  return (
    <div className='my-3'>
      <OrderSummary />
      <OrderDetail />
      <DishCollection />
    </div>
  )
}