import {useState} from "react";
import Customer, {defaultCustomer} from "@src/models/common/Customer.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import BasicDialogProps from "@src/interfaces/BasicModalProps.ts";
import client from "@src/utils/client.ts";

interface MakeCustomerModalProps extends BasicDialogProps {
  reload: () => void;
}

export default function MakeCustomerModal(props: MakeCustomerModalProps) {
  const [newCustomer, setNewCustomer] = useState<Customer>(defaultCustomer);

  function handleClose() {
    props.setopen(false);
  }

  async function handleCreateCustomer() {
    await client.post('/api/manager/customer', newCustomer);
    props.setopen(false);
    props.reload();
  }

  return (
    <Dialog open={props.open} >
      <DialogTitle>
        고객 생성
      </DialogTitle>
      <DialogContent sx={{ width: '350px' }}>
        <div className='py-2'>
          <div className='col d-flex align-items-center mb-3'>
            <div className='col-4'>고객명</div>
            <div>
              <input
                type="text"
                className='form-control'
                value={newCustomer.name}
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </div>
          </div>
          <div className='col d-flex align-items-center mb-3'>
            <div className='col-4'>주소</div>
            <div>
              <input
                type="text"
                className='form-control'
                value={newCustomer.address}
                onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
              />
            </div>
          </div>
          <div className='col d-flex align-items-center mb-3'>
            <div className='col-4'>그릇 놓는 곳<br/>주의사항</div>
            <div>
              <input
                type="text"
                className='form-control'
                value={newCustomer.memo}
                onChange={e => setNewCustomer({...newCustomer, memo: e.target.value})}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button className='btn btn-secondary' onClick={handleClose}>
          취소
        </button>
        <button className='btn btn-primary' onClick={handleCreateCustomer}>
          생성
        </button>
      </DialogActions>
    </Dialog>
  );
}