import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useContext, useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {OrderCategoryContext} from "@src/contexts/common/OrderCategoryContext.tsx";
import client from "@src/utils/client.ts";
import {StatusEnum} from "@src/models/common/StatusEnum.ts";

interface ClickToGoNextProps extends BasicModalProps {
  menu: number | undefined;
  orderstatusid: number | undefined;
  currentstatus: number | undefined;
  reload: () => void;
}

export default function ClickToGoNextModal(props: ClickToGoNextProps) {
  const [orderStatusId, setOrderStatusId] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<number>(0);

  const [paidAmount, setPaidAmount] = useState<string>('');
  const [radioValue, setRadioValue] = useState(1);
  const [orderCategories, ] = useContext(OrderCategoryContext)!;

  function initialize() {
    setPaidAmount('');
    setRadioValue(1);
    props.setopen(false);
  }

  async function handleChangeStatus() {
    await client.put('/api/manager/order', {
      orderId: orderStatusId,
      newStatus: currentStatus + 1,
      paidAmount: parseInt(paidAmount),
      postpaid: radioValue === 2,
      menu: props.menu,
    });
    props.setopen(false);
    props.reload();
  }

  useEffect(() => {
    setOrderStatusId(props.orderstatusid ?? 0);
    setCurrentStatus(props.currentstatus ?? 0);
  }, [props.orderstatusid, props.currentstatus]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        {
          props.currentstatus === StatusEnum.InDelivery ?
            <EnterAmount
              paidamount={paidAmount}
              setpaidamount={setPaidAmount}
              radiovalue={radioValue}
              setradiovalue={setRadioValue}
            /> :
            props.currentstatus === StatusEnum.PendingReceipt && props.menu === 0 ?
              <EnterCustomAmount
                paidamount={paidAmount}
                setpaidamount={setPaidAmount}
                radiovalue={radioValue}
                setradiovalue={setRadioValue}
              /> :
              `상태를 ${orderCategories.find(value => value.status === currentStatus + 1)?.name}(으)로 바꾸시겠습니까?`
        }
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={initialize}>취소</SecondaryButton>
        <PrimaryButton onClick={handleChangeStatus}>확인</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}

interface EnterAmountProps {
  paidamount: string;
  setpaidamount: (paidamount: string) => void;
  radiovalue: number;
  setradiovalue: (radiovalue: number) => void;
}

function EnterCustomAmount({ paidamount, setpaidamount }: EnterAmountProps) {
  return (
    <div>
      <p>금액 입력</p>
      <input
        type="number"
        className='form-control'
        placeholder='금액 입력'
        value={paidamount}
        onChange={e => setpaidamount(e.target.value)}
      />
    </div>
  )
}

function EnterAmount({ paidamount, setpaidamount, radiovalue, setradiovalue }: EnterAmountProps) {
  return (
    <>
      <div className='mb-4'>
        <div className='d-flex'>
          <input
            id='inputBill'
            className='me-2'
            type="radio"
            value={1}
            checked={radiovalue === 1}
            onChange={() => setradiovalue(1)}
          />
          <label htmlFor="inputBill">금액 입력</label>
        </div>
        <input
          type="number"
          className='form-control w-100'
          placeholder='금액 입력'
          disabled={radiovalue === 2}
          value={paidamount ?? ''}
          onChange={e => setpaidamount(e.target.value)}
        />
      </div>
      <div>
        <div className='d-flex'>
          <input
            id='postpaid'
            className='me-2'
            type="radio"
            value={2}
            checked={radiovalue === 2}
            onChange={() => setradiovalue(2)}
          />
          <label htmlFor="postpaid">후불 요청</label>
        </div>
      </div>
    </>
  )
}