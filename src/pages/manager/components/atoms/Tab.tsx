import React from "react";

interface TabProps {
  menu: string;
  setmenu: React.Dispatch<React.SetStateAction<string>>;
}

export default function Tab({ setmenu, menu }: TabProps) {

  return (
    <div >
      <input id="order" type="radio" className='me-2' value="order" checked={menu === 'order'}
             onChange={() => setmenu('order')}/>
      <label htmlFor="order" className='me-4'>주문</label>
      <input id="menu" type="radio" className='me-2' value="menu" checked={menu === 'menu'}
             onChange={() => setmenu('menu')}/>
      <label htmlFor="menu" className='me-4'>메뉴</label>
      <input id="customer" type="radio" className='me-2' value="customer" checked={menu === 'customer'}
             onChange={() => setmenu('customer')}/>
      <label htmlFor="customer">고객</label>
    </div>
  );
}