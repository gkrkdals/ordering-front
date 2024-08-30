import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext} from "react";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {OrderSummaryContext} from "@src/contexts/client/OrderSummary.tsx";

export default function OrderStatusCount() {

  const [orderCategories] = useContext(OrderCategoryContext)!;
  const [orderSummaries] = useContext(OrderSummaryContext)!;

  return (
    <Table tablesize='small' style={{ tableLayout: 'fixed', fontSize: '11pt' }}>
      <TBody>
        <TRow>
          {orderCategories.filter(category => category.status <= 4).map((category) => {
            return <Cell key={category.statusName}>{category.statusName}</Cell>
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

  )
}