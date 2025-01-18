import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useState} from "react";
import FormControl from "@src/components/atoms/FormControl.tsx";
import client from "@src/utils/network/client.ts";

interface ModifyCustomerCreditProps extends BasicModalProps {
  customer: number | undefined;
  customerName: string | undefined;
  reload: () => void;
}

export default function ModifyCustomerCredit(props: ModifyCustomerCreditProps) {
  const [radioValue, setRadioValue] = useState(0);
  const [price, setPrice] = useState<string>('');

  async function handleClickOnConfirm() {
    await client.post('/api/manager/customer/credit', {
      mode: radioValue,
      customer: props.customer,
      price: parseInt(price) * 1000
    });
    props.setOpen(false);
    setRadioValue(0);
    setPrice('');
    props.reload();
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        {props.customerName}
      </DialogTitle>
      <DialogContent>
        <div className='d-flex justify-content-between mb-4'>
          <div>
            <input
              id='credit1'
              className='me-2'
              type="radio"
              checked={radioValue === 0}
              onClick={() => setRadioValue(0)}
            />
            <label htmlFor="credit1">입금액</label>
          </div>
          <div>
            <input
              id='credit2'
              className='me-2'
              type="radio"
              checked={radioValue === 1}
              onClick={() => setRadioValue(1)}
            />
            <label htmlFor="credit2">주문액</label>
          </div>
        </div>
        <p className='mb-2'>금액 입력(천원)</p>
        <FormControl
          type='number'
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder='금액 입력(천원)'
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleClickOnConfirm}>
          변경
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}