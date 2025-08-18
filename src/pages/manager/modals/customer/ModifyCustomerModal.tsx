import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Column, SmallColumn, BigColumn, Wrapper} from "@src/components/atoms/Columns.tsx";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";
import {DangerButton, PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import ModifyCustomerPriceModal from "@src/pages/manager/modals/customer/ModifyCustomerPriceModal.tsx";
import {CustomerRaw} from "@src/models/manager/CustomerRaw.ts";
import Select from "@src/components/atoms/Select.tsx";
import {DiscountGroupContext} from "@src/contexts/manager/DiscountGroupContext.tsx";

interface ModifyCustomerModalProps extends BasicModalProps {
  currentCustomer: CustomerRaw | null;
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
  const [modifyingCustomer, setModifyingCustomer] = useState<CustomerRaw | null>(null);
  const [openModifyCustomPrice, setOpenModifyCustomPrice] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [customerCategories, ] = useContext(CustomerCategoryContext)!;
  const [discountGroups] = useContext(DiscountGroupContext)!;

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
              <SmallColumn>고객명</SmallColumn>
              <BigColumn>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.name}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, name: e.target.value} as CustomerRaw)}
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>주소</SmallColumn>
              <BigColumn>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.address}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, address: e.target.value} as CustomerRaw)}
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>전화번호</SmallColumn>
              <BigColumn>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.tel}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, tel: e.target.value} as CustomerRaw)}
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>층수</SmallColumn>
              <BigColumn>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.floor}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, floor: e.target.value} as CustomerRaw)}
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>비고</SmallColumn>
              <BigColumn>
                <input
                  type="text"
                  className='form-control'
                  value={modifyingCustomer?.memo}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, memo: e.target.value} as CustomerRaw)}
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>고객분류</SmallColumn>
              <BigColumn>
                <select
                  className='form-select'
                  value={modifyingCustomer?.category}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, category: parseInt(e.target.value)} as CustomerRaw)}
                >
                  {customerCategories.map((category, i) => {
                    return (
                      <option key={i} value={category.id}>{category.name}</option>
                    );
                  })}
                </select>
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>할인그룹</SmallColumn>
              <BigColumn>
                <Select
                  value={modifyingCustomer?.discount_group_id}
                  onChange={(e) => setModifyingCustomer({ ...modifyingCustomer, discount_group_id: e.target.value } as CustomerRaw)}
                >
                  <option value="-1">할인그룹 없음</option>
                  {discountGroups.map((group, i) => (
                    <option key={i} value={group.id.toString()}>{group.name}</option>
                  ))}
                </Select>
              </BigColumn>
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