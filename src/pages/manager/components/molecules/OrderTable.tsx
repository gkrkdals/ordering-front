import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import OrderInfoModal from "@src/pages/manager/modals/order/OrderInfoModal.tsx";
import React, {useContext, useState} from "react";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import EnterAmount from "@src/pages/manager/modals/order/EnterAmount.tsx";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";
import client from "@src/utils/client.ts";
import EnterCustomAmount from "@src/pages/manager/components/molecules/EnterCustomOrderAmount.tsx";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";

const columns = [
  '순번',
  '고객명',
  '메뉴',
  '요청사항',
  '상태',
];

export interface OrderStatusWithNumber extends OrderStatusRaw {
  num: number;
}

interface OrderTableProps {
  orderstatus: OrderStatusRaw[];
  page: number;
  count: number;
  reload: () => void;
}

export default function OrderTable({ orderstatus, page, reload, count }: OrderTableProps) {
  const [modifyingOrder, setModifyingOrder] = useState<OrderStatusWithNumber | null>(null);
  const [orderCategories ] = useContext(OrderCategoryContext)!;

  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openStatChangeModal, setOpenStatChangeModal] = useState<boolean>(false);

  const [customerCategories, ] = useContext(CustomerCategoryContext)!;

  const [openEnterCustom, setOpenEnterCustom] = useState(false);

  function handleClickOnRow(orderStatus: OrderStatusRaw, num: number) {
    setModifyingOrder({ ...orderStatus, num });
    setOpenInfoModal(true);
  }

  async function handleClickOnStatus(
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    orderStatus: OrderStatusRaw,
    num: number
  ) {
    e.stopPropagation();
    setModifyingOrder({ ...orderStatus, num });

    if (orderStatus.status === StatusEnum.PendingReceipt && orderStatus.menu === 0) {
      setOpenEnterCustom(true);
    } else if (orderStatus.status === StatusEnum.InDelivery || orderStatus.status === StatusEnum.InPickingUp) {
      setOpenStatChangeModal(true);
    } else {
      await client.put('/api/manager/order', {
        orderId: orderStatus.id,
        newStatus: orderStatus.status + 1,
      });
    }
  }

  function getStatusName(orderStatus: OrderStatusRaw) {
    if(orderStatus.menu === 0 && orderStatus.status === StatusEnum.PendingReceipt) {
      return `${orderStatus.status_name}(금액입력)`;
    } else {
      return orderStatus.status_name;
    }
  }

  return (
    <>
      <Table tablesize='small' style={{ fontSize: '12pt' }}>
        <THead>
          <TRow>
            {columns.map((column, i) => <Cell key={i}>{column}</Cell>)}
          </TRow>
        </THead>
        <TBody>
          {orderstatus.map(((status, i) => {
            return (
              <TRow key={`1-${i}`} style={{ cursor: 'pointer' }} onClick={() => handleClickOnRow(status, (page - 1) * 20 + i + 1)}>
                <Cell style={{ width: 80 }}>{count - ((page - 1) * 20 + i)}</Cell>
                <Cell
                  style={{
                    backgroundColor: `#${customerCategories.find(c => c.id === status.customer_category)?.hex}`,
                  }}
                >{status.customer_name}</Cell>
                <Cell>{status.menu_name}</Cell>
                <Cell>{status.request}</Cell>
                <Cell
                  className='btn-secondary'
                  onClick={(e) => handleClickOnStatus(e, status, (page - 1) * 20 + i + 1)}
                  style={{
                    backgroundColor: `#${orderCategories.find(c => c.id === status.status)?.hex}`
                  }}
                >
                  {getStatusName(status)}
                </Cell>
              </TRow>
            )
          }))}
        </TBody>
      </Table>

      <OrderInfoModal
        modifyingOrder={modifyingOrder}
        reload={reload}
        open={openInfoModal}
        setOpen={setOpenInfoModal}
      />

      <EnterAmount
        modifyingOrder={modifyingOrder}
        reload={reload}
        open={openStatChangeModal}
        setOpen={setOpenStatChangeModal}
      />

      <EnterCustomAmount
        modifyingOrder={modifyingOrder}
        open={openEnterCustom}
        setOpen={setOpenEnterCustom}
        reload={reload}
      />
    </>
  )
}