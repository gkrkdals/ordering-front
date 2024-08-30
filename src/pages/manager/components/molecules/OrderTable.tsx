import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import OrderInfoModal from "@src/pages/manager/modals/OrderInfoModal.tsx";
import React, {useState} from "react";
import {OrderStatusRaw} from "@src/models/common/OrderStatusRaw.ts";
import ClickToGoNextModal from "@src/pages/manager/modals/ClickToGoNextModal.tsx";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";

const columns = [
  '순번',
  '고객명',
  '메뉴',
  '요청사항',
  '상태(클릭하여 다음으로 전환)',
];

export interface OrderStatusWithNumber extends OrderStatusRaw {
  num: number;
}

interface OrderTableProps {
  orderstatus: OrderStatusRaw[];
  page: number;
  reload: () => void;
}

export default function OrderTable({ orderstatus, page, reload }: OrderTableProps) {

  const [modifyingOrder, setModifyingOrder] = useState<OrderStatusWithNumber | null>(null);

  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openStatChangeModal, setOpenStatChangeModal] = useState<boolean>(false);

  function handleClickOnRow(orderStatus: OrderStatusRaw, num: number) {
    setModifyingOrder({ ...orderStatus, num });
    setOpenInfoModal(true);
  }

  function handleClickOnStatus(
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    orderStatus: OrderStatusRaw,
    num: number
  ) {
    e.stopPropagation();

    if (orderStatus.status < StatusEnum.PickupComplete) {
      setModifyingOrder({ ...orderStatus, num });
      setOpenStatChangeModal(true);
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
                <Cell style={{ width: 80 }}>{(page - 1) * 20 + i + 1}</Cell>
                <Cell>{status.customer_name}</Cell>
                <Cell>{status.menu_name}</Cell>
                <Cell>{status.request}</Cell>
                <Cell
                  className='btn-secondary'
                  style={{ width: 300 }}
                  onClick={(e) => handleClickOnStatus(e, status, (page - 1) * 20 + i + 1)}
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
        setopen={setOpenInfoModal}
      />

      <ClickToGoNextModal
        orderstatusid={modifyingOrder?.id}
        currentstatus={modifyingOrder?.status}
        menu={modifyingOrder?.menu}
        reload={reload}
        open={openStatChangeModal}
        setopen={setOpenStatChangeModal}
      />
    </>
  )
}