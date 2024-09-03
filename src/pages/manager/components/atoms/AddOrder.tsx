import {getUser} from "@src/utils/socket.ts";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import React from "react";

interface AddOrderProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function AddOrder({ onClick }: AddOrderProps) {
  return (getUser() === 'manager' || getUser() === 'rider') && (
    <>
      <PrimaryButton onClick={onClick}>
        직접주문
      </PrimaryButton>
      <div className='me-3' />
    </>
  )
}