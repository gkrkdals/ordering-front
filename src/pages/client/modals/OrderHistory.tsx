import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import Customer from "@src/models/common/Customer.ts";
import {useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {dateToString} from "@src/utils/date.ts";

interface StandardInfoCreditProps extends BasicModalProps {
  customer: Customer | null;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
}

export default function OrderHistory({ selectedDates, setSelectedDates, ...props }: StandardInfoCreditProps) {

  const [orders, setOrders] = useState<any[]>([]);
  const [credit, setCredit] = useState<any>({});


  function formatDate(d: string) {
    if (d.length === 0) {
      return '';
    }

    const date = new Date(d);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  function handleClose() {
    props.setOpen(false);
    setSelectedDates([]);
  }

  function stringToLocaleString(d: string) {
    if (d.length === 0 || d === '0') {
      return '';
    }

    return parseInt(d).toLocaleString();
  }

  function ifOrdered(order: any): string {
    if (order.cancelled) {
      return 'text-danger'
    }
    return '';
  }

  useEffect(() => {
    if (props.open && props.customer && selectedDates.length === 2) {
      const start = dateToString(selectedDates[0]).split(' ').at(0)!;
      const end = dateToString(selectedDates[1]).split(' ').at(0)!;

      client.get('/api/settings/history', {
        params: {
          customerId: props.customer.id,
          startDate: start,
          endDate: end,
        }
      }).then(res => {
        setOrders(res.data.orders);
        setCredit(res.data.credit);
      });
    }
  }, [props.open, props.customer, selectedDates]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <div className='d-flex flex-column gap-3'>
          {orders.length > 0 && (
            <Table style={{ fontSize: '0.7rem'}}>
              <TBody>
                <TRow style={{ fontWeight: 'bold' }}>
                  <Cell>미수금</Cell>
                  <Cell>주문액</Cell>
                  <Cell>결제액</Cell>
                  <Cell>잔액</Cell>
                </TRow>
                <TRow>
                  <Cell>{stringToLocaleString(credit.misu)}</Cell>
                  <Cell>{stringToLocaleString(credit.ordered)}</Cell>
                  <Cell>{stringToLocaleString(credit.charged)}</Cell>
                  <Cell>{stringToLocaleString(credit.remaining)}</Cell>
                </TRow>
                <TRow style={{ fontWeight: 'bold', borderTop: '5px solid #ddd' }}>
                  <Cell>시간</Cell>
                  <Cell>메뉴</Cell>
                  <Cell>가격</Cell>
                  <Cell>결제액</Cell>
                </TRow>
                {orders.map((order, i) => (
                  <TRow key={i}>
                    <Cell className={ifOrdered(order)}>{formatDate(order.order_time)}</Cell>
                    <Cell className={ifOrdered(order)} hex={order.hex}>{order.menu_name}</Cell>
                    <Cell className={ifOrdered(order)}>{stringToLocaleString(order.price)}</Cell>
                    <Cell className={ifOrdered(order)}>{order.cancelled ? '취소됨' : stringToLocaleString(order.credit_in)}</Cell>
                  </TRow>
                ))}
              </TBody>
            </Table>
          )}
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