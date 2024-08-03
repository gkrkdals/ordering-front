import React, {ComponentPropsWithoutRef, useContext, useState} from "react";
import {OrderContext} from "@src/contexts/OrderContext.tsx";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import OrderApproveDialog from "@src/pages/client/components/OrderApproveDialog.tsx";
import client from "@src/utils/client.ts";

interface OrderButtonProps extends ComponentPropsWithoutRef<'button'> {
  selectedmenus: SelectedMenu[];
  setselectedmenus: React.Dispatch<React.SetStateAction<SelectedMenu[]>>;
}

export default function OrderButton({ selectedmenus, setselectedmenus, ...props }: OrderButtonProps) {

  const [, setOrders] = useContext(OrderContext);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  async function addOrder() {
    await client.post('/api/order', selectedmenus);
  }

  async function handleOrder() {
    setOrders((prev) => prev.concat(selectedmenus.map((selectedMenu) => ({ stt: 1, name: selectedMenu.menu.name }))));
    setselectedmenus([]);
    setOpenDialog(false);
    await addOrder();
  }

  return (
    <>
      <button
        {...props}
        className='btn btn-primary w-100'
        onClick={() => setOpenDialog(true)}
      >
        주문하기
      </button>

      <OrderApproveDialog
        onClickCancel={() => setOpenDialog(false)}
        onClickProceed={handleOrder}
        open={openDialog}
      />
    </>
  )
}