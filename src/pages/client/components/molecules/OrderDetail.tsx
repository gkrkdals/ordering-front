import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext} from "react";
import {OrderContext} from "@src/contexts/OrderContext.tsx";
import {OrderCategoryContext} from "@src/contexts/OrderCategoryContext.tsx";

export default function OrderDetail() {
  const [orders] = useContext(OrderContext);
  const [orderCategories] = useContext(OrderCategoryContext);

  return (
    <Table small style={{ fontSize: '9pt', tableLayout: 'fixed' }}>
      <TBody>
        {orders.map((order, i) => {
          return (
            <TRow key={i}>
              <Cell>{order.name}</Cell>
              <Cell>{orderCategories.find((category) => category.code === order.stt).sttname}</Cell>
            </TRow>
          )
        })}
      </TBody>
    </Table>
  )
}