import {getUser} from "@src/utils/network/socket.ts";
import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import React from "react";
import {isNative} from "@src/utils/native/native.ts";
import {MuteButton} from "@src/pages/manager/components/atoms/MuteButton.tsx";

interface AddOrderProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  muted?: boolean;
  setMuted?: (muted: boolean) => void;
  isRemaining?: boolean;
  setIsRemaining?: (isRemaining: boolean) => void;
  reload?: () => void;
}

export default function AddOrder({ reload, onClick, muted, setMuted, isRemaining, setIsRemaining }: AddOrderProps) {
  return (
    <div className='d-flex'>
      {!isNative() && (
        <>
          <MuteButton muted={muted} setMuted={setMuted}/>
          <div className='me-3'/>
        </>
      )}
      {reload && (
        <>
          <PrimaryButton onClick={reload}>
            <i className="bi bi-arrow-clockwise" />
          </PrimaryButton>
          <div className='me-3'/>
        </>
      )}
      {getUser() !== 'cook' && (
        <>
          <PrimaryButton onClick={onClick}>직접주문</PrimaryButton>
          <div className='me-3'/>
          <input
            id='remaining'
            type="checkbox"
            className='form-check-input my-auto me-3'
            checked={isRemaining}
            onChange={() => (setIsRemaining ?? function() {})(!isRemaining)}
          />
        </>
      )}
    </div>
  )
}