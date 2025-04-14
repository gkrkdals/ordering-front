import {Cell, Sort, HeadCell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import OrderInfoModal from "@src/pages/manager/modals/order/OrderInfoModal.tsx";
import React, {useContext, useState} from "react";
import {OrderStatusRaw} from "@src/models/manager/OrderStatusRaw.ts";
import EnterAmount from "@src/pages/manager/modals/order/EnterAmount.tsx";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";
import client from "@src/utils/network/client.ts";
import EnterCustomAmount from "@src/pages/manager/components/molecules/EnterCustomOrderAmount.tsx";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import {Column} from "@src/models/manager/Column.ts";
import {useRecoilState, useRecoilValue} from "recoil";
import userState from "@src/recoil/atoms/UserState.ts";
import {PermissionEnum} from "@src/models/manager/PermissionEnum.ts";
import {getUser} from "@src/utils/network/socket.ts";
import recentJobState from "@src/recoil/atoms/RecentJobState.ts";

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
}

export default function OrderTable({ columns, orderstatus, page, reload, count, sort, setSort, isRemaining }: OrderTableProps) {
  const [modifyingOrder, setModifyingOrder] = useState<OrderStatusWithNumber | null>(null);
  const [orderCategories ] = useContext(OrderCategoryContext)!;

  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openStatChangeModal, setOpenStatChangeModal] = useState<boolean>(false);

  const [customerCategories, ] = useContext(CustomerCategoryContext)!;

  const [openEnterCustom, setOpenEnterCustom] = useState(false);

  const [cannotUpdate, setCannotUpdate] = useState(false);

  const user = useRecoilValue(userState)!;

  const [, setRecentJob] = useRecoilState(recentJobState);

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

    if (getUser() === 'cook' && orderStatus.status > StatusEnum.InPreparation) {
      return;
    }

    if (orderStatus.status !== StatusEnum.PickupComplete) {
      setModifyingOrder({ ...orderStatus, num });

      if (orderStatus.status === StatusEnum.PendingReceipt && orderStatus.menu === 0) {
        setOpenEnterCustom(true);
      } else if (orderStatus.status === StatusEnum.InDelivery || orderStatus.status === StatusEnum.InPickingUp) {
        setOpenStatChangeModal(true);
      } else if (!(user?.permission === PermissionEnum.Cook && orderStatus.status > StatusEnum.WaitingForDelivery)) {
        if (!cannotUpdate) {
          setCannotUpdate(true);
          try {
            await client.put('/api/manager/order', {
              orderId: orderStatus.id,
              newStatus: orderStatus.status + 1,
            });
            setRecentJob(prev => prev.concat({
              orderCode: orderStatus.order_code,
              oldStatus: orderStatus.status,
              newStatus: orderStatus.status + 1
            }));
          } catch (e) {
            console.error(e)
          } finally {
            setCannotUpdate(false);
          }
        }
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
                  {cannotUpdate ? '(처리 중)' : getStatusName(status)}
                </Cell>
                {isRemaining && <Cell>{status.credit / 1000}</Cell>}
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
        cannotUpdate={cannotUpdate}
        setCannotUpdate={setCannotUpdate}
        modifyingOrder={modifyingOrder}
        open={openStatChangeModal}
        setOpen={setOpenStatChangeModal}
      />

      <EnterCustomAmount
        cannotUpdate={cannotUpdate}
        setCannotUpdate={setCannotUpdate}
        modifyingOrder={modifyingOrder}
        open={openEnterCustom}
        setOpen={setOpenEnterCustom}
      />
    </>
  )
}