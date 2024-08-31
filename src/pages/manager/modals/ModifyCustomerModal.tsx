import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import Customer from "@src/models/common/Customer.ts";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Column, ColumnLeft, ColumnRight} from "@src/components/atoms/Columns.tsx";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";

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

  const [customerCategories, ] = useContext(CustomerCategoryContext)!;

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
            <Column>
              <ColumnLeft>고객명</ColumnLeft>
              <ColumnRight>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.name}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, name: e.target.value} as Customer)}
                />
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>주소</ColumnLeft>
              <ColumnRight>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.address}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, address: e.target.value} as Customer)}
                />
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>그릇 놓는 곳/<br/>주의사항</ColumnLeft>
              <ColumnRight>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.memo}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, memo: e.target.value} as Customer)}
                />
              </ColumnRight>
            </Column>
            <Column>
              <ColumnLeft>거래처분류</ColumnLeft>
              <ColumnRight>
                <select
                  className='form-select'
                  value={modifyingCustomer?.category}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, category: parseInt(e.target.value)} as Customer)}
                >
                  {customerCategories.map((category, i) => {
                    return (
                      <option key={i} value={category.id}>{category.name}</option>
                    );
                  })}
                </select>
              </ColumnRight>
            </Column>
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