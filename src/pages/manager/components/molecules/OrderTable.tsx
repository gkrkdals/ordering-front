import {Cell, Sort, HeadCell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import OrderInfoModal from "@src/pages/manager/modals/order/OrderInfoModal.tsx";
import React, {useContext, useState} from "react";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import EnterAmount from "@src/pages/manager/modals/order/EnterAmount.tsx";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";
import client from "@src/utils/client.ts";
import EnterCustomAmount from "@src/pages/manager/components/molecules/EnterCustomOrderAmount.tsx";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {Column} from "@src/models/manager/Column.ts";
import {useRecoilValue} from "recoil";
import userState from "@src/recoil/atoms/UserState.ts";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";
import {formatCurrency} from "@src/utils/data.ts";

export interface OrderStatusWithNumber extends OrderStatusRaw {
  num: number;
}

interface OrderTableProps {
  columns: Column[];
  orderstatus: OrderStatusRaw[];
  page: number;
  count: number;
  reload: () => void;
  sort: Sort;
  setSort: (focusInfo: Sort) => void;
  isRemaining: boolean;
  setIsRemaining: (isRemaining: boolean) => void;
}

export default function OrderTable({ columns, orderstatus, page, reload, count, sort, setSort, isRemaining, setIsRemaining }: OrderTableProps) {
  const [modifyingOrder, setModifyingOrder] = useState<OrderStatusWithNumber | null>(null);
  const [orderCategories ] = useContext(OrderCategoryContext)!;

  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openStatChangeModal, setOpenStatChangeModal] = useState<boolean>(false);

  const [customerCategories, ] = useContext(CustomerCategoryContext)!;

  const [openEnterCustom, setOpenEnterCustom] = useState(false);

  const user = useRecoilValue(userState)!;

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
    if (orderStatus.status !== StatusEnum.PickupComplete) {
      setModifyingOrder({ ...orderStatus, num });

      if (orderStatus.status === StatusEnum.PendingReceipt && orderStatus.menu === 0) {
        setOpenEnterCustom(true);
      } else if (orderStatus.status === StatusEnum.InDelivery || orderStatus.status === StatusEnum.InPickingUp) {
        setOpenStatChangeModal(true);
      } else if (!(user?.permission === PermissionEnum.Cook && orderStatus.status > StatusEnum.WaitingForDelivery)) {
        await client.put('/api/manager/order', {
          orderId: orderStatus.id,
          newStatus: orderStatus.status + 1,
        });
      }
    }
  }

  function getStatusName(orderStatus: OrderStatusRaw) {
    if(orderStatus.menu === 0 && orderStatus.status === StatusEnum.PendingReceipt) {
      return `${orderStatus.status_name}(금액입력)`;
    } else {
      if (user?.permission === PermissionEnum.Cook && orderStatus.status > StatusEnum.InPreparation) {
        return '조리완료';
      } else {
        return orderStatus.status_name;
      }
    }
  }

  function getBackgroundColor(orderStatus: OrderStatusRaw) {
    if (user?.permission === PermissionEnum.Cook && orderStatus.status > StatusEnum.InPreparation) {
      return `#${orderCategories.find(category => category.status === StatusEnum.WaitingForDelivery)?.hex}`;
    } else {
      return `#${orderCategories.find(category => category.status === orderStatus.status)?.hex}`;
    }
  }

  return (
    <>
      <Table tablesize='small' style={{ fontSize: '12pt' }}>
        <THead>
          <TRow>
            {
              columns
                .filter((_, i) => isRemaining ? i !== 0 : i !== columns.length - 1)
                .map((column, i) =>
                  <HeadCell
                    focusIndex={isRemaining ? i + 1 : i}
                    sort={sort}
                    setSort={setSort}
                    key={i}
                  >
                    {column.name}
                  </HeadCell>
                )
            }
          </TRow>
        </THead>
        <TBody>
          {orderstatus.map(((status, i) => {
            return (
              <TRow key={`1-${i}`} style={{ cursor: 'pointer' }} onClick={() => handleClickOnRow(status, (page - 1) * 20 + i + 1)}>
                {!isRemaining && <Cell style={{width: 50}}>{count - ((page - 1) * 20 + i)}</Cell>}
                <Cell
                  style={{
                    backgroundColor: `#${customerCategories.find(c => c.id === status.customer_category)?.hex}`,
                  }}
                >{status.customer_name}</Cell>
                <Cell
                  style={{
                    fontWeight: status.menu === 0 ? 'bolder' : 'normal',
                  }}
                >
                  {status.menu_name}
                </Cell>
                <Cell>{status.request}</Cell>
                <Cell
                  className='btn-secondary'
                  onClick={(e) => handleClickOnStatus(e, status, (page - 1) * 20 + i + 1)}
                  style={{ backgroundColor: getBackgroundColor(status) }}
                >
                  {getStatusName(status)}
                </Cell>
                {isRemaining && <Cell>{formatCurrency(status.credit)}</Cell>}
              </TRow>
            )
          }))}
        </TBody>
      </Table>
      {user?.permission !== PermissionEnum.Cook && (
        <div className='form-check mt-1'>
          <input
            id='remaining'
            type="checkbox"
            className='form-check-input'
            checked={isRemaining}
            onChange={() => setIsRemaining(!isRemaining)}
          />
          <label htmlFor="remaining" className='form-check-label'>그릇수거</label>
        </div>
      )}

      <OrderInfoModal
        modifyingOrder={modifyingOrder}
        reload={reload}
        open={openInfoModal}
        setOpen={setOpenInfoModal}
      />

      <EnterAmount
        modifyingOrder={modifyingOrder}
        open={openStatChangeModal}
        setOpen={setOpenStatChangeModal}
      />

      <EnterCustomAmount
        modifyingOrder={modifyingOrder}
        open={openEnterCustom}
        setOpen={setOpenEnterCustom}
      />
    </>
  )
}