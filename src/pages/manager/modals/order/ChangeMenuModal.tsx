import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import SelectMenu from "@src/components/molecules/SelectMenu.tsx";
import {MenuContext} from "@src/contexts/manager/MenuContext.tsx";

interface ChangeMenuModalProps extends BasicModalProps {
  currentOrder: OrderStatusWithNumber | null;
  setCurrentOrder: (newOrder: OrderStatusWithNumber | null) => void;
  setFlag: (flag: boolean) => void;
}

export default function ChangeMenuModal({ currentOrder, ...props }: ChangeMenuModalProps) {
  const [menus, ] = useContext(MenuContext)!;

  const [selectedMenu, setSelectedMenu] = useState<number>(-1);
  const [price, setPrice] = useState('');
  const [request, setRequest] = useState('');


  function initialize() {
    setTimeout(() => {
      setSelectedMenu(-1);
      setPrice('');
      setRequest('');
    }, 300);
  }

  function handleClose() {
    props.setOpen(false);
    initialize();
  }

  async function handleChangeMenu() {
    const value = menus.find(menu => menu.id === selectedMenu)?.name;
    await client.put('/api/manager/order/menu', {
      orderCode: currentOrder?.order_code,
      from: currentOrder?.menu,
      to: selectedMenu,
      price: parseInt(price) * 1000,
      request: request,
    });
    props.setOpen(false);
    initialize();
    props.setCurrentOrder({
      ...currentOrder,
      menu_name: value,
      menu: selectedMenu
    } as OrderStatusWithNumber);
    props.setFlag(true);
  }

  useEffect(() => {
    if (props.open && currentOrder) {
      setRequest(currentOrder.request);
    }
  }, [currentOrder, props.open]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p>변경 전 메뉴: {currentOrder?.menu_name}</p>
        <p className='mb-1'>변경 후 메뉴</p>
        <SelectMenu
          uniqueId={'changemenumodal'}
          menus={menus}
          setSelectedMenu={setSelectedMenu}
          setPrice={setPrice}
        />
        <p/>
        <p className='mb-1'>가격(천원)</p>
        <FormControl
          type='number'
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder='가격 입력'
        />
        <p/>
        <p className='mb-1'>요청사항</p>
        <FormControl
          type='text'
          value={request}
          onChange={e => setRequest(e.target.value)}
          placeholder='빈 요청사항'
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>
          취소
        </SecondaryButton>
        <PrimaryButton onClick={handleChangeMenu}>
          적용
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}