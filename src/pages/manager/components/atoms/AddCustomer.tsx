import React, {useState} from "react";
import {getUser} from "@src/utils/network/socket.ts";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import UploadCustomersModal from "@src/pages/manager/modals/customer/UploadCustomersModal.tsx";

interface AddCustomerProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function AddCustomer({ onClick }: AddCustomerProps) {
  const [open, setOpen] = useState(false);

  return (getUser() === 'manager' || getUser() === 'rider') && (
    <>
      <PrimaryButton onClick={onClick}>고객 추가</PrimaryButton>
      <div className='me-3'/>
      <PrimaryButton onClick={() => setOpen(true)}>일괄 추가</PrimaryButton>
      <div className='me-3'/>

      <UploadCustomersModal open={open} setOpen={setOpen} />
    </>
  )
}