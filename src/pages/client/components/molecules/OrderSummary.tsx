import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext} from "react";
import {OrderContext} from "@src/contexts/OrderContext.tsx";
import {OrderCategoryContext} from "@src/contexts/OrderCategoryContext.tsx";

export default function OrderSummary() {

  const [orders] = useContext(OrderContext);
  const [orderCategories] = useContext(OrderCategoryContext);

  return (
    <Table small style={{ tableLayout: 'fixed', fontSize: '9pt' }}>
      <TBody>
        <TRow>
          {orderCategories.map((category) => {
            return <Cell key={category.sttname}>{category.sttname}</Cell>
          })}
        </TRow>
        <TRow>
          {orderCategories.map((category, i) => {
            return (
              <Cell key={i}>
                {orders.filter((order) => order.stt === category.code).length}건
              </Cell>
            )
          })}
        </TRow>
      </TBody>
    </Table>

  )
}