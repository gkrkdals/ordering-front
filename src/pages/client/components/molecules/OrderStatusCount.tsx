import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import {useContext} from "react";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";

interface OrderStatusCountProps {
  orderSummaryCount: { status: number, count: number }[];
}

export default function OrderStatusCount({ orderSummaryCount }: OrderStatusCountProps) {

  const [orderCategories] = useContext(OrderCategoryContext)!;

  return (
    <Table tablesize='small' style={{ tableLayout: 'fixed', fontSize: '11pt' }}>
      <TBody>
        <TRow>
          {
            orderCategories
              .filter(category => category.status <= StatusEnum.InDelivery)
              .map((category) =>
                <Cell key={category.name} style={{ backgroundColor: `#${category.hex}`}}>{category.name}</Cell>
              )
          }
        </TRow>
        <TRow>
          {
            orderCategories
              .filter(category => category.status <= StatusEnum.InDelivery)
              .map((category, i) => {
                return (
                  <Cell key={i}>
                    {orderSummaryCount.find((order) => order.status === category.status)?.count ?? 0}건
                  </Cell>
                );
              })
          }
        </TRow>
      </TBody>
    </Table>
  );
}