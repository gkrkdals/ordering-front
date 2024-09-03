import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import Customer from "@src/models/common/Customer.ts";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Column, ColumnLeft, ColumnRight, Wrapper} from "@src/components/atoms/Columns.tsx";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";
import {DangerButton, PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import ModifyCustomerPriceModal from "@src/pages/manager/modals/ModifyCustomerPriceModal.tsx";

interface ModifyCustomerModalProps extends BasicModalProps {
  currentCustomer: Customer | null;
  reload: () => void;
}

export function ModifyCustomerModal(
  {
    open,
    setOpen,
    currentCustomer,
    reload,
  }: ModifyCustomerModalProps
) {
  const [modifyingCustomer, setModifyingCustomer] = useState<Customer | null>(null);
  const [openModifyCustomPrice, setOpenModifyCustomPrice] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [customerCategories, ] = useContext(CustomerCategoryContext)!;

  async function handleProceedingDeletion() {
    setOpen(false);
    setConfirmDelete(true);
  }

  async function handleUpdate() {
    await client.put('/api/manager/customer', modifyingCustomer);
    setOpen(false);
    reload();
  }

  async function handleDelete() {
    await client.delete('/api/manager/customer', { params: { id: modifyingCustomer?.id } });
    setConfirmDelete(false);
    reload();
  }

  useEffect(() => {
    setModifyingCustomer(currentCustomer);
  }, [currentCustomer]);

  return (
    <>
      <Dialog open={open} onClose={setOpen}>
        <DialogTitle>
          고객 변경
        </DialogTitle>
        <DialogContent>
          <Wrapper>
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
              <ColumnLeft>비고</ColumnLeft>
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
              <ColumnLeft>고객분류</ColumnLeft>
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
          </Wrapper>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setOpen(false)}>취소</SecondaryButton>
          <SecondaryButton onClick={() => setOpenModifyCustomPrice(true)}>
            금액설정
          </SecondaryButton>
          <DangerButton onClick={handleProceedingDeletion}>삭제</DangerButton>
          <PrimaryButton onClick={handleUpdate}>적용</PrimaryButton>
        </DialogActions>
      </Dialog>

      <ModifyCustomerPriceModal
        customer={modifyingCustomer}
        reload={reload}
        open={openModifyCustomPrice}
        setOpen={setOpenModifyCustomPrice}
      />

      <Dialog open={confirmDelete}>
        <DialogContent>
          정말 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setConfirmDelete(false)}>취소</SecondaryButton>
          <DangerButton onClick={handleDelete}>삭제</DangerButton>
        </DialogActions>
      </Dialog>
    </>
  )
}