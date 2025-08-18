import React, {ComponentPropsWithoutRef, useState} from "react";
import SelectedMenu from "@src/models/client/SelectedMenu.ts";
import OrderApproveDialog from "@src/pages/client/modals/OrderApproveDialog.tsx";
import client from "@src/utils/network/client.ts";
import {AxiosError} from "axios";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import FindMenuModal from "@src/pages/client/modals/settings/FindMenuModal.tsx";
import Menu from "@src/models/common/Menu.ts";
import OrderCompletedDialog from "@src/pages/client/modals/OrderCompletedDialog.tsx";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";

interface OrderButtonProps extends ComponentPropsWithoutRef<'button'> {
  selectedMenus: SelectedMenu[];
  setSelectedMenus: React.Dispatch<React.SetStateAction<SelectedMenu[]>>;
  addMenuFromFind: (menus: Menu[]) => void;
}

export default function OrderButton({ selectedMenus, setSelectedMenus, addMenuFromFind, ...props }: OrderButtonProps) {

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSoldOutDialog, setOpenSoldOutDialog] = useState(false);
  const [openFindMenuDialog, setOpenFindMenuDialog] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const customer = useRecoilValue(customerState);

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
    setOpenDialog(false);
    await addOrder();
  }

  return (
    <>
      <div className="d-flex gap-2">
        <button 
          className="btn btn-secondary w-100"
          onClick={() => setOpenFindMenuDialog(true)}
          disabled={isOrdering}
        >
          메뉴 검색
        </button>
        <button
          {...props}
          className='btn btn-primary w-100'
          onClick={async () => {
            if (selectedMenus.length !== 0) {
              if (customer?.showConfirm === 1) {
                setOpenDialog(true);
              } else {
                await addOrder();
              }
            }
          }}
          disabled={isOrdering}
        >
          {isOrdering ? '주문 중...' : '주문하기'}
        </button>
      </div>

      <FindMenuModal
        open={openFindMenuDialog}
        setOpen={setOpenFindMenuDialog}
        addMenuFromFind={addMenuFromFind}
      />

      <OrderApproveDialog
        selectedMenus={selectedMenus}
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

      <OrderCompletedDialog
        selectedMenus={selectedMenus}
        setSelectedMenus={setSelectedMenus}
        open={orderComplete}
        setOpen={setOrderComplete}
      />
    </>
  )
}