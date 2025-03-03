import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";
import {useState} from "react";
import UploadMenusModal from "@src/pages/manager/modals/menu/UploadMenusModal.tsx";

interface AddMenuProps {
  onClick: () => void;
}

export default function AddMenu({ onClick }: AddMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='d-flex'>
        <PrimaryButton onClick={onClick}>메뉴 추가</PrimaryButton>
        <div className='me-2'/>
        <PrimaryButton onClick={() => setOpen(true)}>일괄 추가</PrimaryButton>
        <div className='me-2'/>
      </div>

      <UploadMenusModal open={open} setOpen={setOpen} />
    </>
  )
}