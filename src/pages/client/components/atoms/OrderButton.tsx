import React, {ComponentPropsWithoutRef, useState} from "react";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import OrderApproveDialog from "@src/pages/client/components/OrderApproveDialog.tsx";
import client from "@src/utils/network/client.ts";
import {AxiosError} from "axios";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
interface OrderButtonProps extends ComponentPropsWithoutRef<'button'> {
  selectedMenus: SelectedMenu[];
  setSelectedMenus: React.Dispatch<React.SetStateAction<SelectedMenu[]>>;
}

export default function OrderButton({ selectedMenus, setSelectedMenus, ...props }: OrderButtonProps) {

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSoldOutDialog, setOpenSoldOutDialog] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  async function addOrder() {
    setIsOrdering(true);
    try {
      await client.post('/api/order', selectedMenus);
      window.dispatchEvent(new CustomEvent("reloadLast"));
      setOrderComplete(true);
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 400) {
        setOpenSoldOutDialog(true);
      }
    } finally {
      setIsOrdering(false);
    }
  }

  async function handleOrder() {
    setSelectedMenus([]);
    setOpenDialog(false);
    await addOrder();
  }

  return (
    <>
      <button
        {...props}
        className='btn btn-primary w-100'
        onClick={() => setOpenDialog(true)}
        disabled={isOrdering}
      >
        {isOrdering ? '주문 중...' : '주문하기'}
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
          <SecondaryButton onClick={() => {
            window.dispatchEvent(new CustomEvent('reload'));
            setOpenSoldOutDialog(false);
          }}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>

      <Dialog open={orderComplete}>
        <DialogContent>
          주문이 완료되었습니다.
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setOrderComplete(false)}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </>
  )
}