import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import Calendar from "react-calendar";
import React from "react";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import type {Value} from "react-calendar/dist/cjs/shared/types.js";
import './MyCalendar.css';

interface StandardInfoCalendarProps extends BasicModalProps {
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  setOpenHistory: (open: boolean) => void;
}

export default function OrderHistoryCalendar({ selectedDates, setSelectedDates, setOpenHistory, ...props }: StandardInfoCalendarProps) {

  function handleClose() {
    setSelectedDates([]);
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

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p style={{ fontSize: '1.2rem' }}>
          날짜 범위 선택
        </p>
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
          disabled={selectedDates.length !== 2}
          onClick={handleSearch}
        >
          검색
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}