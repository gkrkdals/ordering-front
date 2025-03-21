import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import client from "@src/utils/network/client.ts";
import {OrderStatusWithNumber} from "@src/pages/manager/components/molecules/OrderTable.tsx";
import {useRecoilState} from "recoil";
import recentJobState from "@src/recoil/atoms/RecentJobState.ts";

interface ClickToGoNextProps extends BasicModalProps {
  cannotUpdate: boolean;
  setCannotUpdate: (cannotUpdate: boolean) => void;
  modifyingOrder: OrderStatusWithNumber | null;
}

export default function EnterAmount({ cannotUpdate, setCannotUpdate, modifyingOrder, ...props }: ClickToGoNextProps) {
  const [orderStatusId, setOrderStatusId] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<number>(0);

  const [paidAmount, setPaidAmount] = useState<string>('');

  const [, setRecentJob] = useRecoilState(recentJobState);

  function initialize() {
    setPaidAmount('');
    props.setOpen(false);
  }

  async function handleChangeStatus() {
    if (!cannotUpdate) {
      setCannotUpdate(true);
      try {
        await client.put('/api/manager/order', {
          orderId: orderStatusId,
          newStatus: currentStatus + 1,
          paidAmount: parseInt(paidAmount) * 1000,
          postpaid: isNaN(parseInt(paidAmount)) || parseInt(paidAmount) === 0,
          menu: modifyingOrder?.menu,
        });
        setRecentJob(prev => prev.concat({
          orderCode: modifyingOrder?.order_code ?? 0,
          oldStatus: currentStatus,
          newStatus: currentStatus + 1
        }))
      } catch (e) {
        console.error(e);
      } finally {
        setCannotUpdate(false);
        initialize();
      }
    }
  }

  useEffect(() => {
    setOrderStatusId(modifyingOrder?.id ?? 0);
    setCurrentStatus(modifyingOrder?.status ?? 0);
  }, [modifyingOrder?.id, modifyingOrder?.status]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p className='mb-1 text-secondary'>잔액을 입력하지 않으면 후불 처리됩니다.</p>
        <p>잔금: {modifyingOrder ? (modifyingOrder.credit / 1000).toLocaleString() : 0}</p>
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
        <button className='btn btn-secondary w-50' style={{fontSize: 19}} onClick={initialize}>취소</button>
        <button className='btn btn-primary w-50' style={{fontSize: 19}} onClick={handleChangeStatus}>확인</button>
      </DialogActions>
    </Dialog>
  );
}