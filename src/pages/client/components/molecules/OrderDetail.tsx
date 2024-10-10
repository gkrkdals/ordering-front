import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext} from "react";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {OrderSummaryContext} from "@src/contexts/client/OrderSummaryContext.tsx";
export default function OrderDetail() {
  const [orderCategories] = useContext(OrderCategoryContext)!;
  const [orderSummary] = useContext(OrderSummaryContext)!;

  return (
    <Table tablesize='small' style={{ fontSize: '11pt', tableLayout: 'fixed' }}>
      <TBody>
        {orderSummary.map((order, i) => {
          const category = orderCategories.find((category) => category.status === order.status);

          return (
            <TRow key={i}>
              <Cell>{order.menuName}</Cell>
              <Cell style={{ backgroundColor: `#${category?.hex}` }}>
                {category?.name}
              </Cell>
            </TRow>
          )
        })}
      </TBody>
    </Table>
  )
}