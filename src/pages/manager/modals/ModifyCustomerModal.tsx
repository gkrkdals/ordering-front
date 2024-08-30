import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import Customer from "@src/models/common/Customer.ts";
import {useEffect, useState} from "react";
import client from "@src/utils/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

interface ModifyCustomerModalProps extends BasicModalProps {
  currentCustomer: Customer | null;
  reload: () => void;
}

export function ModifyCustomerModal(
  {
    open,
    setopen,
    currentCustomer,
    reload,
  }: ModifyCustomerModalProps
) {
  const [modifyingCustomer, setModifyingCustomer] = useState<Customer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    setModifyingCustomer(currentCustomer);
  }, [currentCustomer]);

  async function handleUpdate() {
    await client.put('/api/manager/customer', modifyingCustomer);
    setopen(false);

    reload();
  }

  async function handleDelete() {
    await client.delete('/api/manager/customer', { params: { id: modifyingCustomer?.id } });
    setConfirmDelete(false);

    reload();
  }

  return (
    <>
      <Dialog open={open} onClose={setopen}>
        <DialogTitle>
          고객 변경
        </DialogTitle>
        <DialogContent sx={{ width: '350px' }}>
          <div className='py-2'>
            <div className='col d-flex align-items-center mb-3'>
              <div className='col-3'>고객명</div>
              <div>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.name}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, name: e.target.value} as Customer)}
                />
              </div>
            </div>
            <div className='col d-flex align-items-center mb-3'>
              <div className='col-3'>주소</div>
              <div>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.address}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, address: e.target.value} as Customer)}
                />
              </div>
            </div>
            <div className='col d-flex align-items-center mb-3'>
              <div className='col-3'>그릇 놓는 곳/주의사항</div>
              <div>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.memo}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, memo: e.target.value} as Customer)}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary' onClick={() => setopen(false)}>취소</button>
          <button
            className='btn btn-danger'
            onClick={() => { setopen(false); setConfirmDelete(true); }}
          >
            삭제
          </button>
          <button className='btn btn-primary' onClick={handleUpdate}>적용</button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete}>
        <DialogContent>
          정말 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <button className='btn btn-secondary' onClick={() => setConfirmDelete(false)}>취소</button>
          <button className='btn btn-danger' onClick={handleDelete}>삭제</button>
        </DialogActions>
      </Dialog>
    </>
  )
}