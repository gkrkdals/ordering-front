import React from "react";
import {getUser} from "@src/utils/socket.ts";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";

interface AddCustomerProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function AddCustomer({ onClick }: AddCustomerProps) {
  return (getUser() === 'manager' || getUser() === 'rider') && (
    <>
      <PrimaryButton onClick={onClick}>고객 추가</PrimaryButton>
      <div className='me-3'/>
    </>
  )
}