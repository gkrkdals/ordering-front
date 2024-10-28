import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext} from "react";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {OrderSummaryContext} from "@src/contexts/client/OrderSummaryContext.tsx";
import {OrderSummary} from "@src/models/client/OrderSummary.ts";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";
export default function OrderDetail() {
  const [orderCategories] = useContext(OrderCategoryContext)!;
  const [orderSummary] = useContext(OrderSummaryContext)!;

  function isNotCompleted(order: OrderSummary) {
    return order.status < StatusEnum.AwaitingPickup;
  }

  return (
    <Table tablesize='small' style={{ fontSize: '11pt', tableLayout: 'fixed' }}>
      <TBody>
        {orderSummary.map((order, i) => {
          const category = orderCategories.find((category) => category.status === order.status);

          return (
            <TRow key={i}>
              <Cell style={{ fontWeight: isNotCompleted(order) ? 'bold' : undefined }}>{order.menuName}</Cell>
              <Cell style={{ backgroundColor: `#${category?.hex}`, fontWeight: isNotCompleted(order) ? 'bold' : undefined }}>
                {category?.name}
              </Cell>
            </TRow>
          )
        })}
      </TBody>
    </Table>
  )
}