import {useState} from "react";
import Customer, {defaultCustomer} from "@src/models/common/Customer.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import client from "@src/utils/client.ts";
import {Column, ColumnLeft, ColumnRight, Wrapper} from "@src/components/atoms/Columns.tsx";
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
            <ColumnLeft>고객명</ColumnLeft>
            <ColumnRight>
              <input
                type="text"
                className='form-control'
                value={newCustomer.name}
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </ColumnRight>
          </Column>
          <Column>
            <ColumnLeft className='col-4'>주소</ColumnLeft>
            <ColumnRight>
              <input
                type="text"
                className='form-control'
                value={newCustomer.address}
                onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
              />
            </ColumnRight>
          </Column>
          <Column>
            <ColumnLeft>비고</ColumnLeft>
            <ColumnRight>
              <input
                type="text"
                className='form-control'
                value={newCustomer.memo}
                onChange={e => setNewCustomer({...newCustomer, memo: e.target.value})}
              />
            </ColumnRight>
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