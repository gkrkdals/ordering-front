import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import React, {useContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Column, SmallColumn, BigColumn, Wrapper} from "@src/components/atoms/Columns.tsx";
import {CustomerCategoryContext} from "@src/contexts/manager/CustomerCategoryContext.tsx";
import {DangerButton, PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {CustomerRaw} from "@src/models/manager/CustomerRaw.ts";
import FormControl from "@src/components/atoms/FormControl";
import {formatDate} from "@src/utils/date.ts";
import {
  POINT_CANCELED_COLOR,
  POINT_TYPE_LABEL,
  PointHistoryItem,
} from "@src/models/common/PointEnum.ts";
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
  const [discountGroups, ] = useContext(DiscountGroupContext)!;
  const [modifyingCustomer, setModifyingCustomer] = useState<CustomerRaw | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [openPointHistory, setOpenPointHistory] = useState<boolean>(false);
  const [pointHistory, setPointHistory] = useState<PointHistoryItem[]>([]);
  const [pointHistoryLoading, setPointHistoryLoading] = useState<boolean>(false);
  const [pointAdjustMode, setPointAdjustMode] = useState<number>(0);
  const [pointAdjustAmount, setPointAdjustAmount] = useState<string>('');
  const [pointAdjustMemo, setPointAdjustMemo] = useState<string>('');

  const [customerCategories, ] = useContext(CustomerCategoryContext)!;
  // const [discountGroups] = useContext(DiscountGroupContext)!;

  async function handleProceedingDeletion() {
    setOpen(false);
    setConfirmDelete(true);
  }

  async function handleUpdate() {
    await client.put('/api/manager/customer', {
      ...modifyingCustomer,
      rewardPerBowl: modifyingCustomer?.reward_per_bowl,
      rewardPerMenu: modifyingCustomer?.reward_per_menu,
    });
    setOpen(false);
    reload();
  }

  async function handleDelete() {
    await client.delete('/api/manager/customer', { params: { id: modifyingCustomer?.id } });
    setConfirmDelete(false);
    reload();
  }

  async function handleOpenPointHistory() {
    if (!modifyingCustomer?.id) return;
    setPointHistoryLoading(true);
    setOpenPointHistory(true);
    try {
      const res = await client.get('/api/manager/customer/point-history', {
        params: { id: modifyingCustomer.id },
      });
      setPointHistory(res.data);
    } finally {
      setPointHistoryLoading(false);
    }
  }

  async function handleAdjustPoint() {
    if (!modifyingCustomer?.id) return;

    const amount = parseInt(pointAdjustAmount);
    if (!/^\d+$/.test(pointAdjustAmount) || isNaN(amount) || amount <= 0) {
      alert('올바른 적립금 금액을 입력해주세요');
      return;
    }

    try {
      await client.post('/api/manager/customer/point', {
        customer: modifyingCustomer.id,
        mode: pointAdjustMode,
        amount,
        memo: pointAdjustMemo,
      });
      const diff = pointAdjustMode === 0 ? amount : -amount;
      setModifyingCustomer({
        ...modifyingCustomer,
        point_balance: (modifyingCustomer.point_balance ?? 0) + diff,
      } as CustomerRaw);
      setPointAdjustAmount('');
      setPointAdjustMemo('');
      reload();
    } catch (err: any) {
      alert(err.response?.data?.message ?? '적립금 조정에 실패했습니다');
    }
  }

  useEffect(() => {
    setModifyingCustomer(currentCustomer);
    setPointAdjustMode(0);
    setPointAdjustAmount('');
    setPointAdjustMemo('');
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
              <SmallColumn>고객 그룹</SmallColumn>
              <BigColumn>
                <Select
                  value={modifyingCustomer?.discount_group_id ?? -1}
                  onChange={(e) => setModifyingCustomer({ ...modifyingCustomer, discount_group_id: parseInt(e.target.value) } as CustomerRaw)}
                >
                  <option value="-1">그룹 없음</option>
                  {discountGroups.map((group, i) => (
                    <option key={i} value={group.id.toString()}>{group.name}</option>
                  ))}
                </Select>
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>적립금</SmallColumn>
              <BigColumn>
                <FormControl
                  type="number"
                  value={modifyingCustomer?.point_balance}
                  disabled
                  suffix='백원'
                />
              </BigColumn>
            </Column>
            <Column>
              <SmallColumn>적립금 조정</SmallColumn>
              <BigColumn>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <select
                    className='form-select'
                    style={{ width: '80px' }}
                    value={pointAdjustMode}
                    onChange={(e) => setPointAdjustMode(parseInt(e.target.value))}
                  >
                    <option value={0}>지급</option>
                    <option value={1}>차감</option>
                  </select>
                  <FormControl
                    type="number"
                    value={pointAdjustAmount}
                    onChange={(e) => setPointAdjustAmount(e.target.value)}
                    suffix='백원'
                  />
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  <input
                    type="text"
                    className='form-control'
                    placeholder='조정 사유'
                    value={pointAdjustMemo}
                    onChange={(e) => setPointAdjustMemo(e.target.value)}
                  />
                  <SecondaryButton style={{ whiteSpace: 'nowrap' }} onClick={handleAdjustPoint}>
                    조정
                  </SecondaryButton>
                </div>
              </BigColumn>
            </Column>
            <p className='text-secondary mt-3 mb-1' style={{ fontSize: '0.85em' }}>
              적립을 0으로 두면 고객 그룹 설정을 따릅니다. 메뉴 금액은 고객 그룹에서만 정합니다.
            </p>
            <Column>
              <SmallColumn>메뉴주문 적립</SmallColumn>
              <BigColumn>
                <FormControl 
                  type="number"
                  value={modifyingCustomer?.reward_per_menu}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, reward_per_menu: parseInt(e.target.value)} as CustomerRaw)}
                  suffix='백원'
                />
              </BigColumn>
            </Column>

            <Column>
              <SmallColumn>그릇수거 적립</SmallColumn>
              <BigColumn>
                <FormControl
                  type="number"
                  value={modifyingCustomer?.reward_per_bowl}
                  onChange={(e) => setModifyingCustomer({...modifyingCustomer, reward_per_bowl: parseInt(e.target.value)} as CustomerRaw)}
                  suffix='백원'
                />
              </BigColumn>
            </Column>

            <Column>
              <SmallColumn>전체품절 적용</SmallColumn>
              <BigColumn>
                {modifyingCustomer?.is_sold_out === 1 ? (
                  <SecondaryButton style={{width: 85}} onClick={() => setModifyingCustomer({...modifyingCustomer, is_sold_out: 0} as CustomerRaw)}>
                    비활성화
                  </SecondaryButton>
                ) : (
                  <PrimaryButton style={{width: 85}} onClick={() => setModifyingCustomer({...modifyingCustomer, is_sold_out: 1} as CustomerRaw)}>
                    활성화
                  </PrimaryButton>
                )}
              </BigColumn>
            </Column>
            
          </Wrapper>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setOpen(false)}>취소</SecondaryButton>
          <SecondaryButton onClick={handleOpenPointHistory}>
            적립금 내역
          </SecondaryButton>
          <DangerButton onClick={handleProceedingDeletion}>삭제</DangerButton>
          <PrimaryButton onClick={handleUpdate}>적용</PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* 적립금 내역 모달 */}
      <Dialog open={openPointHistory} onClose={() => setOpenPointHistory(false)}>
        <DialogTitle>
          적립금 내역 — {modifyingCustomer?.name}
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px', maxHeight: '480px' }}>
          {pointHistoryLoading ? (
            <p className='text-secondary text-center py-3'>불러오는 중...</p>
          ) : pointHistory.length === 0 ? (
            <p className='text-secondary text-center py-3'>내역이 없습니다.</p>
          ) : (
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '4px 6px' }}>날짜</th>
                  <th style={{ padding: '4px 6px' }}>구분</th>
                  <th style={{ padding: '4px 6px', textAlign: 'right' }}>금액(백원)</th>
                </tr>
              </thead>
              <tbody>
                {pointHistory.map((item) => {
                  const isCanceled = item.isCanceled === 1;
                  const rowStyle: React.CSSProperties = isCanceled
                    ? { color: POINT_CANCELED_COLOR }
                    : {};
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', ...rowStyle }}>
                      <td style={{ padding: '4px 6px', whiteSpace: 'nowrap' }}>
                        {formatDate(item.createdAt)}
                      </td>
                      <td style={{ padding: '4px 6px' }}>
                        {isCanceled
                          ? <span style={{ color: POINT_CANCELED_COLOR, fontWeight: 600 }}>취소됨</span>
                          : (POINT_TYPE_LABEL[item.pathType] ?? item.pathType)}
                      </td>
                      <td style={{ padding: '4px 6px', textAlign: 'right' }}>
                        {isCanceled
                          ? <span style={{ color: POINT_CANCELED_COLOR }}>취소됨</span>
                          : item.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setOpenPointHistory(false)}>닫기</SecondaryButton>
        </DialogActions>
      </Dialog>

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