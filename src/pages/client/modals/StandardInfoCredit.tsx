import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {Cell, Table, TBody, TRow} from "@src/components/tables/Table.tsx";
import Customer from "@src/models/common/Customer.ts";
import {useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {dateToString} from "@src/utils/date.ts";

interface StandardInfoCreditProps extends BasicModalProps {
  customer: Customer | null;
}

export default function StandardInfoCredit(props: StandardInfoCreditProps) {

  const [orders, setOrders] = useState<any[]>([]);
  const [credit, setCredit] = useState<any>({});
  const [searched, setSearched] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  async function handleSearch() {
    if (props.customer) {
      const res = await client.get('/api/settings/history', {
        params: {
          customerId: props.customer.id,
          startDate,
          endDate,
        }
      });
      setSearched(true);
      setOrders(res.data.orders);
      setCredit(res.data.credit);
    }
  }

  function formatDate(d: string) {
    if (d.length === 0) {
      return '';
    }

    const date = new Date(d);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  function initialize() {
    props.setOpen(false);
    setTimeout(() => {
      setStartDate('');
      setEndDate('');
      setSearched(false);
      setOrders([]);
      setCredit({});
    }, 300)
  }

  function stringToLocaleString(d: string) {
    if (d.length === 0 || d === '0') {
      return '';
    }

    return parseInt(d).toLocaleString();
  }

  useEffect(() => {
    if (props.open && props.customer) {
      const today = new Date();
      const todayString = dateToString(today).split(' ').at(0)!;
      setStartDate(todayString);
      setEndDate(todayString);
    }
  }, [props.open, props.customer]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <div className='d-flex flex-column gap-3'>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <label htmlFor="startDate" style={{width: 100}}>시작일</label>
            </div>
            <input
              type="date"
              id='startDate'
              className='form-control'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className='d-flex'>
            <div className='d-flex align-items-center'>
              <label htmlFor="endDate" style={{width: 100}}>종료일</label>
            </div>
            <input
              type="date"
              id='endDate'
              className='form-control'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <PrimaryButton style={{ width: '100%'}} onClick={handleSearch}>
            검색
          </PrimaryButton>
          {searched && (
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
                    <Cell>{formatDate(order.order_time)}</Cell>
                    <Cell hex={order.hex}>{order.menu_name}</Cell>
                    <Cell>{stringToLocaleString(order.price)}</Cell>
                    <Cell>{stringToLocaleString(order.credit_in)}</Cell>
                  </TRow>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={initialize}>
          닫기
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  )
}