import React, {useState} from "react";
import {getUser} from "@src/utils/network/socket.ts";
import SettingButton from "@src/pages/manager/components/atoms/SettingButton.tsx";
import SettingModal from "@src/pages/manager/modals/settings/SettingModal.tsx";

interface TabProps {
  menu: string;
  setMenu: React.Dispatch<React.SetStateAction<string>>;
}

export default function Tab({ setMenu, menu }: TabProps) {

  const [openSettingModal, setOpenSettingModal] = useState(false);

  return getUser() === 'manager' && (
    <>
      <div className='d-flex mb-2'>
        <SettingButton setOpen={setOpenSettingModal}/>
        <div className='me-2'/>
        <input id="order" type="radio" className='me-2' value="order" checked={menu === 'order'}
               onChange={() => setMenu('order')}/>
        <label htmlFor="order" className='me-4 my-auto'>주문</label>
        <input id="menu" type="radio" className='me-2' value="menu" checked={menu === 'menu'}
               onChange={() => setMenu('menu')}/>
        <label htmlFor="menu" className='me-4 my-auto'>메뉴</label>
        <input id="customer" type="radio" className='me-2 ' value="customer" checked={menu === 'customer'}
               onChange={() => setMenu('customer')}/>
        <label htmlFor="customer" className='my-auto'>고객</label>
      </div>

      <SettingModal open={openSettingModal} setOpen={setOpenSettingModal} />
    </>
  );
}