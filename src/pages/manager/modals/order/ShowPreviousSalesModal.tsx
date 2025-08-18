import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import Order from "@src/models/common/Order.ts";
import client from "@src/utils/network/client.ts";
import {dateToString} from "@src/utils/date.ts";
import {formatCurrency} from "@src/utils/data.ts";
import {Cell, StartCell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";

interface ShowPreviousSalesModalProps extends BasicModalProps {
  date: Date;
}

export default function ShowPreviousSalesModal({ open, date, ...props }: ShowPreviousSalesModalProps) {

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (open) {
      client
        .get('/api/manager/order/sales', {
          params: {
            date: dateToString(date),
          }
        })
        .then((res) => setOrders(res.data));
    }
  }, [open, date]);

  function handleClose() {
    props.setOpen(false);
    setTimeout(() => setOrders([]), 300);
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일 매출
      </DialogTitle>
      <DialogContent>
        해당일 총 매출: {formatCurrency(orders.reduce((prev, current) => prev + current.price, 0))}
        <div className='my-3' />
        <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <Table style={{ fontSize: 12 }}>
            <THead>
              <TRow>
                <Cell>순번</Cell>
                <Cell>고객명</Cell>
                <Cell>메뉴명</Cell>
              </TRow>
            </THead>
            <TBody>
              {orders.map((order, i) => (
                <TRow key={i}>
                  <Cell>{orders.length - i}</Cell>
                  <StartCell hex={order.customerJoin.categoryJoin?.hex}>{order.customerJoin.name}</StartCell>
                  <StartCell hex={order.menuJoin.menuCategory?.hex}>{order.menuJoin.name}</StartCell>
                </TRow>
              ))}
            </TBody>
          </Table>
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>
          닫기
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  )
}