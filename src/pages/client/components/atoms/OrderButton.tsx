import React, {ComponentPropsWithoutRef, useState} from "react";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import OrderApproveDialog from "@src/pages/client/components/OrderApproveDialog.tsx";
import client from "@src/utils/client.ts";
import {AxiosError} from "axios";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
interface OrderButtonProps extends ComponentPropsWithoutRef<'button'> {
  selectedmenus: SelectedMenu[];
  setselectedmenus: React.Dispatch<React.SetStateAction<SelectedMenu[]>>;
}

export default function OrderButton({ selectedmenus, setselectedmenus, ...props }: OrderButtonProps) {

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSoldOutDialog, setOpenSoldOutDialog] = useState(false);

  async function addOrder() {
    try {
      await client.post('/api/order', selectedmenus);
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 400) {
        setOpenSoldOutDialog(true);
      }
    }
  }

  async function handleOrder() {
    setselectedmenus([]);
    setOpenDialog(false);
    await addOrder();
  }

  function handleClose() {
    setOpenSoldOutDialog(false);
    window.dispatchEvent(new CustomEvent('reload'));
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

      <Dialog open={openSoldOutDialog}>
        <DialogContent>
          주문하신 메뉴 중 품절인 메뉴가 있습니다.
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </>
  )
}