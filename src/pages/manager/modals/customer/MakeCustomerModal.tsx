import {useState} from "react";
import Customer, {defaultCustomer} from "@src/models/common/Customer.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import client from "@src/utils/network/client.ts";
import {Column, SmallColumn, BigColumn, Wrapper} from "@src/components/atoms/Columns.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";

interface MakeCustomerModalProps extends BasicDialogProps {
  reload: () => void;
}

export default function MakeCustomerModal(props: MakeCustomerModalProps) {
  const [newCustomer, setNewCustomer] = useState<Customer>(defaultCustomer);

  function handleClose() {
    props.setOpen(false);
  }

  async function handleCreateCustomer() {
    await client.post('/api/manager/customer', newCustomer);
    props.setOpen(false);
    props.reload();
  }

  return (
    <Dialog open={props.open} >
      <DialogTitle>
        고객 생성
      </DialogTitle>
      <DialogContent sx={{ width: '350px' }}>
        <Wrapper>
          <Column>
            <SmallColumn>고객명</SmallColumn>
            <BigColumn>
              <input
                type="text"
                className='form-control'
                value={newCustomer.name}
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </BigColumn>
          </Column>
          <Column>
            <SmallColumn>주소</SmallColumn>
            <BigColumn>
              <input
                type="text"
                className='form-control'
                value={newCustomer.address}
                onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
              />
            </BigColumn>
          </Column>
          <Column>
            <SmallColumn>층수</SmallColumn>
            <BigColumn>
              <input
                type="text"
                className='form-control'
                value={newCustomer.floor}
                onChange={e => setNewCustomer({...newCustomer, floor: e.target.value})}
              />
            </BigColumn>
          </Column>
          <Column>
            <SmallColumn>비고</SmallColumn>
            <BigColumn>
              <input
                type="text"
                className='form-control'
                value={newCustomer.memo}
                onChange={e => setNewCustomer({...newCustomer, memo: e.target.value})}
              />
            </BigColumn>
          </Column>
        </Wrapper>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>취소</SecondaryButton>
        <PrimaryButton onClick={handleCreateCustomer}>생성</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}