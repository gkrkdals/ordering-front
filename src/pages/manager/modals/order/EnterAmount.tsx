import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import client from "@src/utils/client.ts";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {formatCurrency} from "@src/utils/data.ts";

interface ClickToGoNextProps extends BasicModalProps {
  modifyingOrder: OrderStatusWithNumber | null;
}

export default function EnterAmount({ modifyingOrder, ...props }: ClickToGoNextProps) {
  const [orderStatusId, setOrderStatusId] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<number>(0);

  const [paidAmount, setPaidAmount] = useState<string>('');

  function initialize() {
    setPaidAmount('');
    props.setOpen(false);
  }

  async function handleChangeStatus() {
    await client.put('/api/manager/order', {
      orderId: orderStatusId,
      newStatus: currentStatus + 1,
      paidAmount: parseInt(paidAmount) * 1000,
      postpaid: isNaN(parseInt(paidAmount)) || parseInt(paidAmount) === 0,
      menu: modifyingOrder?.menu,
    });
    initialize();
  }

  useEffect(() => {
    setOrderStatusId(modifyingOrder?.id ?? 0);
    setCurrentStatus(modifyingOrder?.status ?? 0);
  }, [modifyingOrder?.id, modifyingOrder?.status]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p className='mb-1 text-secondary'>잔액을 입력하지 않으면 후불 처리됩니다.</p>
        <p>잔금: {formatCurrency(modifyingOrder?.credit)}</p>
        <div className='mb-4'>
          <input
            type="number"
            className='form-control w-100'
            placeholder='금액 입력(천원)'
            value={paidAmount ?? ''}
            onChange={e => setPaidAmount(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={initialize}>취소</SecondaryButton>
        <PrimaryButton onClick={handleChangeStatus}>확인</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}