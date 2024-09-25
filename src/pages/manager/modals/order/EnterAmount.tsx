import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import client from "@src/utils/client.ts";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {formatCurrency} from "@src/utils/data.ts";

interface ClickToGoNextProps extends BasicModalProps {
  modifyingOrder: OrderStatusWithNumber | null;
  reload: () => void;
}

export default function EnterAmount({ modifyingOrder, ...props }: ClickToGoNextProps) {
  const [orderStatusId, setOrderStatusId] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<number>(0);

  const [paidAmount, setPaidAmount] = useState<string>('');
  const [radioValue, setRadioValue] = useState(1);

  function initialize() {
    setPaidAmount('');
    setRadioValue(1);
    props.setOpen(false);
  }

  async function handleChangeStatus() {
    await client.put('/api/manager/order', {
      orderId: orderStatusId,
      newStatus: currentStatus + 1,
      paidAmount: parseInt(paidAmount) * 1000,
      postpaid: radioValue === 2,
      menu: modifyingOrder?.menu,
    });
    initialize();
    props.reload();
  }

  useEffect(() => {
    setOrderStatusId(modifyingOrder?.id ?? 0);
    setCurrentStatus(modifyingOrder?.status ?? 0);
  }, [modifyingOrder?.id, modifyingOrder?.status]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p>잔금: {formatCurrency(modifyingOrder?.credit)}</p>
        <div className='mb-4'>
          <div className='d-flex'>
            <input
              id='inputBill'
              className='me-2'
              type="radio"
              value={1}
              checked={radioValue === 1}
              onChange={() => setRadioValue(1)}
            />
            <label htmlFor="inputBill">금액 입력(천원)</label>
          </div>
          <input
            type="number"
            className='form-control w-100'
            placeholder='금액 입력(천원)'
            disabled={radioValue === 2}
            value={paidAmount ?? ''}
            onChange={e => setPaidAmount(e.target.value)}
          />
        </div>
        <div>
          <div className='d-flex'>
            <input
              id='postpaid'
              className='me-2'
              type="radio"
              value={2}
              checked={radioValue === 2}
              onChange={() => setRadioValue(2)}
            />
            <label htmlFor="postpaid">후불 요청</label>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={initialize}>취소</SecondaryButton>
        <PrimaryButton onClick={handleChangeStatus}>확인</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}