import React, {useRef, useState} from "react";
import {getUser} from "@src/utils/network/socket.ts";
import SettingButton from "@src/pages/manager/components/atoms/SettingButton.tsx";
import SettingModal from "@src/pages/manager/modals/settings/SettingModal.tsx";
import GoBackButton from "@src/pages/manager/components/atoms/GoBackButton.tsx";
import client from "@src/utils/network/client.ts";
import {useRecoilState} from "recoil";
import recentJobState from "@src/recoil/atoms/RecentJobState.ts";

interface TabProps {
  menu: string;
  setMenu: React.Dispatch<React.SetStateAction<string>>;
}

export default function Tab({ setMenu, menu }: TabProps) {

  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const historyRef = useRef<string[]>([]);
  const [recentJob, setRecentJob] = useRecoilState(recentJobState);
  const userStateRef = useRef<string>(getUser());

  function handleChangeMenu(menuName: string) {
    setHistory(history.concat(menuName));
    historyRef.current.push(menu);
    setMenu(menuName);
  }

  async function handleGoBack() {
    const job = recentJob.at(-1);
    console.log(recentJob);

    if (job) {
      try {
        await client.put('/api/manager/order/rollback', job);
        setRecentJob(recentJob.slice(0, -1));
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (userStateRef.current === 'manager' || userStateRef.current === 'rider') && (
    <>
      <div className='d-flex mb-2'>
        <GoBackButton handleGoBack={handleGoBack} disabled={menu !== 'order'} />
        <div className='me-2'/>
        {userStateRef.current === 'manager' && (
          <>
            <SettingButton setOpen={setOpenSettingModal}/>
            <div className='me-2'/>
            <input id="order" type="radio" className='me-2' value="order" checked={menu === 'order'}
                   onChange={() => handleChangeMenu('order')}/>
            <label htmlFor="order" className='me-4 my-auto'>주문</label>
            <input id="menu" type="radio" className='me-2' value="menu" checked={menu === 'menu'}
                   onChange={() => handleChangeMenu('menu')}/>
            <label htmlFor="menu" className='me-4 my-auto'>메뉴</label>
            <input id="customer" type="radio" className='me-2 ' value="customer" checked={menu === 'customer'}
                   onChange={() => handleChangeMenu('customer')}/>
            <label htmlFor="customer" className='my-auto'>고객</label>
          </>
        )}
      </div>

      <SettingModal open={openSettingModal} setOpen={setOpenSettingModal} />
    </>
  );
}