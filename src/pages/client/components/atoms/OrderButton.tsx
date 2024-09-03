import React, {ComponentPropsWithoutRef, useContext, useState} from "react";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import OrderApproveDialog from "@src/pages/client/components/OrderApproveDialog.tsx";
import client from "@src/utils/client.ts";
import {OrderSummaryContext} from "@src/contexts/client/OrderSummaryContext.tsx";

interface OrderButtonProps extends ComponentPropsWithoutRef<'button'> {
  selectedmenus: SelectedMenu[];
  setselectedmenus: React.Dispatch<React.SetStateAction<SelectedMenu[]>>;
}

export default function OrderButton({ selectedmenus, setselectedmenus, ...props }: OrderButtonProps) {

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [, setOrderSummaries] = useContext(OrderSummaryContext)!;

  async function addOrder() {
    await client.post('/api/order', selectedmenus);
  }

  async function handleOrder() {
    setselectedmenus([]);
    setOpenDialog(false);
    await addOrder();

    const res = await client.get('/api/order/summary');
    setOrderSummaries(res.data.map(summary =>({ ...summary, statusName: summary['status_name'], menuName: summary['menu_name'] })));
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
        setOpen={setOpenDialog}
      />
    </>
  )
}