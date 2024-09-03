import {PrimaryButton} from "@src/components/atoms/Buttons.tsx";

interface AddMenuProps {
  onClick: () => void;
}

export default function AddMenu({ onClick }: AddMenuProps) {
  return (
    <>
      <PrimaryButton onClick={onClick}>메뉴 추가</PrimaryButton>
      <div className='me-3'/>
    </>
  )
}