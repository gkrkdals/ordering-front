import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import Calendar from "react-calendar";
import React, {useContext, useEffect, useState} from "react";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import type {Value} from "react-calendar/dist/cjs/shared/types.js";
import './MyCalendar.css';
import OrderHistory from "@src/pages/manager/modals/OrderHistory.tsx";
import {CustomerContext} from "@src/contexts/manager/CustomerContext.tsx";
import Customer from "@src/models/common/Customer.ts";
import FormControl from "@src/components/atoms/FormControl.tsx";

interface StandardInfoCalendarProps extends BasicModalProps {}

export default function OrderHistoryCalendar(props: StandardInfoCalendarProps) {

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [customers] = useContext(CustomerContext)!;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchCustomer, setSearchCustomer] = useState("");

  function handleClose() {
    setTimeout(() => {
      setSelectedDates([]);
      setSelectedCustomer(null);
      setSearchCustomer('');
    }, 200);
    props.setOpen(false);
  }

  function handleSearch() {
    props.setOpen(false);
    setTimeout(() => setOpenHistory(true), 100);
  }

  function handleChangeDate(value: Value, _: React.MouseEvent<HTMLButtonElement>) {
    const date = value as Date;

    if (selectedDates.length === 0) {
      setSelectedDates([date]);
    } else if (selectedDates.length === 1) {
      const [firstDate] = selectedDates;
      if (firstDate.getTime() === date.getTime()) {
        setSelectedDates([]);
      } else {
        const sorted = [firstDate, date].sort((a, b) => a.getTime() - b.getTime());
        setSelectedDates(sorted);
      }
    } else {
      setSelectedDates([date]);
    }
  }

  function isInRange(date: Date) {
    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;
      return date.getTime() > start.getTime() && date.getTime() < end.getTime();
    }
  }

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view !== 'month') return;
    if (selectedDates.some(d => d.toDateString() === date.toDateString())) {
      return 'selected-date';
    }
    if (isInRange(date)) {
      return 'in-range';
    }
    return null;
  }

  useEffect(() => {
    setSelectedCustomer(customers.find(c => c.name === searchCustomer) ?? null);
  }, [searchCustomer]);



  return (
    <>
      <Dialog open={props.open}>
        <DialogContent>
          <div className='d-flex justify-content-between mb-3'>
            <FormControl
              value={searchCustomer}
              onChange={e => setSearchCustomer(e.target.value)}
              placeholder='고객 검색'
              list='historyCustomers'
            />
            <datalist id='historyCustomers'>
              {customers.map((item, i) => (
                <option key={i} value={item.name}>{item.tel}</option>
              ))}
            </datalist>
          </div>
          <div className='mb-3'>
            <span className='text-secondary' style={{ fontSize: '1.1rem' }}>
              선택된 고객: {selectedCustomer?.name}
            </span>
          </div>
          <div className='d-flex justify-content-center' style={{ fontSize: '0.8rem' }}>
            <Calendar
              locale={'ko-KR'}
              calendarType='gregory'
              onChange={handleChangeDate}
              tileClassName={tileClassName}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton
            onClick={handleClose}
          >
            닫기
          </SecondaryButton>
          <PrimaryButton
            disabled={selectedDates.length !== 2 || !selectedCustomer}
            onClick={handleSearch}
          >
            검색
          </PrimaryButton>
        </DialogActions>
      </Dialog>
      <OrderHistory
        customer={selectedCustomer}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        open={openHistory}
        setOpen={setOpenHistory}
        setSearchCustomer={setSearchCustomer}
        setSelecedCustomer={setSelectedCustomer}
      />
    </>
  );
}