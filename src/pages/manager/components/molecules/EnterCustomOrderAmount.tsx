import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useState} from "react";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import client from "@src/utils/client.ts";

interface EnterCustomAmountProps extends BasicModalProps {
  modifyingOrder: OrderStatusWithNumber | null;
  reload: () => void;
}

export default function EnterCustomAmount({ open, setOpen, modifyingOrder, reload }: EnterCustomAmountProps) {

  const [paidAmount, setPaidAmount] = useState('');

  async function handleClickOnConfirm() {
    await client.put('/api/manager/order', {
      orderId: modifyingOrder?.id,
      newStatus: (modifyingOrder?.status ?? 0) + 1,
      paidAmount: parseInt(paidAmount) * 1000,
      menu: modifyingOrder?.menu,
    });
    setOpen(false);
    setPaidAmount('');
    reload();
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <div>
          <p>금액 입력(천원)</p>
          <input
            type="number"
            className='form-control'
            placeholder='금액 입력(천원)'
            value={paidAmount}
            onChange={e => setPaidAmount(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleClickOnConfirm}>
          입력
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}
