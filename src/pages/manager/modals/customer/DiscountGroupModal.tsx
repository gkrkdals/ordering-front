import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {DangerButton, PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useContext, useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {Cell, Table, TBody, THead, TRow} from "@src/components/tables/Table.tsx";
import {DiscountGroupExt} from "@src/models/manager/DiscountGroup.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import Select from "@src/components/atoms/Select.tsx";
import {DiscountGroupContext} from "@src/contexts/manager/DiscountGroupContext.tsx";
import GroupPriceModal from "@src/pages/manager/modals/customer/GroupPriceModal.tsx";
import DisposalTimeModal from "@src/pages/manager/modals/settings/features/DisposalTimeModal.tsx";
import {POINT_UNIT_MESSAGE, pointToWon, wonTextToPoint} from "@src/utils/point.ts";

interface DiscountGroupModalProps extends BasicModalProps {}

export default function DiscountGroupModal(props: DiscountGroupModalProps) {


  const [modifiedDiscountGroups, setModifiedDiscountGroups] = useState<DiscountGroupExt[]>([]);
  const [addedDiscountGroups, setAddedDiscountGroups] = useState<DiscountGroupExt[]>([]);
  const [, setDiscountGroups] = useContext(DiscountGroupContext)!;

  const [openGroupPrice, setOpenGroupPrice] = useState(false);
  const [priceTargetGroup, setPriceTargetGroup] = useState<DiscountGroupExt | null>(null);

  const [openDisposalTime, setOpenDisposalTime] = useState(false);
  const [disposalTargetGroup, setDisposalTargetGroup] = useState<DiscountGroupExt | null>(null);

  function handleOpenGroupPrice(group: DiscountGroupExt) {
    setPriceTargetGroup(group);
    setOpenGroupPrice(true);
  }

  function handleOpenDisposalTime(group: DiscountGroupExt) {
    setDisposalTargetGroup(group);
    setOpenDisposalTime(true);
  }

  const onChange1 = (index: number, key: string, value: any) => {
    setModifiedDiscountGroups(modifiedDiscountGroups.map((p, i) => {
      if (i ===  index) {
        p[key] = value;
        p.modified = true;
      }
      return p;
    }))
  };

  const onChange2 = (index: number, key: string, value: any) => {
    setAddedDiscountGroups(addedDiscountGroups.map((p, i) => {
      if (i ===  index) {
        p[key] = value;
      }
      return p;
    }))
  };

  const onDelete1 = (index: number) => {
    setModifiedDiscountGroups(modifiedDiscountGroups.map((p, i) => {
      if (i === index) {
        p.deleted = true;
      }
      return p;
    }));
  };

  const onDelete2 = (index: number) => {
    setAddedDiscountGroups(addedDiscountGroups.filter((_, i) => i !== index));
  };

  function handleAddNewRow() {
    setAddedDiscountGroups(addedDiscountGroups.concat({
      id: 0,
      name: '',
      discountType: 'amount',
      discountValue: 0,
      description: '',
      rewardPerMenu: null,
      rewardPerBowl: null,
      modified: false,
      deleted: false,
    }))
  }

  function initialize() {
    setModifiedDiscountGroups([]);
    setAddedDiscountGroups([]);
  }

  function handleClose() {
    props.setOpen(false);
    setTimeout(initialize, 300);
  }

  /** 화면에서는 적립을 원 단위로 다루므로 저장 직전에 백원으로 되돌린다 */
  function toPayload(groups: DiscountGroupExt[]) {
    return groups.map(group => ({
      ...group,
      rewardPerMenu: wonTextToPoint(String(group.rewardPerMenu ?? '')),
      rewardPerBowl: wonTextToPoint(String(group.rewardPerBowl ?? '')),
    }));
  }

  async function handleSave() {
    const modified = toPayload(modifiedDiscountGroups);
    const added = toPayload(addedDiscountGroups);

    const hasInvalid = [...modified, ...added]
      .some(group => group.rewardPerMenu === undefined || group.rewardPerBowl === undefined);

    if (hasInvalid) {
      alert(POINT_UNIT_MESSAGE);
      return;
    }

    await client.put('/api/manager/customer/discount-group', {
      modified,
      added,
    });
    handleClose();
    const res = await client.get('/api/manager/customer/discount-group');
    setDiscountGroups(res.data);
  }

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/customer/discount-group')
        .then(res => setModifiedDiscountGroups(toDisplay(res.data)));
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "900px", // Set your desired max-width here
          },
        },
      }}
    >
      <DialogTitle>
        고객 그룹 설정
      </DialogTitle>
      <DialogContent style={{width: '100%'}}>
        <p className='text-secondary mb-3' style={{ fontSize: '0.9em' }}>
          할인값은 유형이 <b>일정금액</b>이면 원, <b>퍼센트</b>면 %입니다.
          적립은 <b>원 단위</b>로 입력하며, 저장 단위 때문에 <b>100원 단위</b>로만 지정할 수 있습니다.
          적립을 비워두면 고객별 설정을 따르고, 고객에도 값이 없으면 적립하지 않습니다.
        </p>
        <Table>
          <THead>
            <TRow>
              <Cell style={{ width: 140 }}>그룹명</Cell>
              <Cell style={{ width: 105 }}>유형</Cell>
              <Cell style={{ width: 95 }}>할인값<br/><small className='text-muted'>원 / %</small></Cell>
              <Cell style={{ width: 95 }}>메뉴적립<br/><small className='text-muted'>원</small></Cell>
              <Cell style={{ width: 95 }}>수거적립<br/><small className='text-muted'>원</small></Cell>
              <Cell>비고</Cell>
              <Cell style={{ width: 230 }}></Cell>
            </TRow>
          </THead>
          <TBody>
            {modifiedDiscountGroups
              .filter((p) => !p.deleted)
              .map((discountGroup, i) => (
              <TRow key={`modified-${i}`}>
                <Cell>
                  <FormControl
                    value={discountGroup.name}
                    onChange={e => onChange1(i, 'name', e.target.value)}
                  />
                </Cell>
                <Cell>
                  <Select
                    value={discountGroup.discountType}
                    onChange={e => onChange1(i, 'discountType', e.target.value)}
                  >
                    <option value='amount'>일정금액</option>
                    <option value="percent">퍼센트</option>
                  </Select>
                </Cell>
                <Cell>
                  <FormControl
                    type="number"
                    value={discountGroup.discountValue}
                    onChange={e => onChange1(i, 'discountValue', e.target.value)}
                  />
                </Cell>
                <Cell>
                  <FormControl
                    type="number"
                    value={discountGroup.rewardPerMenu ?? ''}
                    onChange={e => onChange1(i, 'rewardPerMenu', e.target.value)}
                    placeholder='미설정'
                  />
                </Cell>
                <Cell>
                  <FormControl
                    type="number"
                    value={discountGroup.rewardPerBowl ?? ''}
                    onChange={e => onChange1(i, 'rewardPerBowl', e.target.value)}
                    placeholder='미설정'
                  />
                </Cell>
                <Cell>
                  <FormControl
                    value={discountGroup.description}
                    onChange={e => onChange1(i, 'description', e.target.value)}
                  />
                </Cell>
                <Cell>
                  <div className='d-flex gap-1'>
                    <SecondaryButton small onClick={() => handleOpenGroupPrice(discountGroup)}>
                      가격
                    </SecondaryButton>
                    <SecondaryButton small style={{ whiteSpace: 'nowrap' }} onClick={() => handleOpenDisposalTime(discountGroup)}>
                      수거시간
                    </SecondaryButton>
                    <DangerButton small onClick={() => onDelete1(i)}>
                      삭제
                    </DangerButton>
                  </div>
                </Cell>
              </TRow>
            ))}
            {addedDiscountGroups.map((discountGroup, i) => (
              <TRow key={`added-${i}`}>
                <Cell>
                  <FormControl
                    value={discountGroup.name}
                    onChange={e => onChange2(i, 'name', e.target.value)}
                  />
                </Cell>
                <Cell>
                  <Select
                    value={discountGroup.discountType}
                    onChange={e => onChange2(i, 'discountType', e.target.value)}
                  >
                    <option value='amount'>일정금액</option>
                    <option value="percent">퍼센트</option>
                  </Select>
                </Cell>
                <Cell>
                  <FormControl
                    type="number"
                    value={discountGroup.discountValue}
                    onChange={e => onChange2(i, 'discountValue', e.target.value)}
                  />
                </Cell>
                <Cell>
                  <FormControl
                    type="number"
                    value={discountGroup.rewardPerMenu ?? ''}
                    onChange={e => onChange2(i, 'rewardPerMenu', e.target.value)}
                    placeholder='미설정'
                  />
                </Cell>
                <Cell>
                  <FormControl
                    type="number"
                    value={discountGroup.rewardPerBowl ?? ''}
                    onChange={e => onChange2(i, 'rewardPerBowl', e.target.value)}
                    placeholder='미설정'
                  />
                </Cell>
                <Cell>
                  <FormControl
                    value={discountGroup.description}
                    onChange={e => onChange2(i, 'description', e.target.value)}
                  />
                </Cell>
                <Cell>
                  {/* 가격은 그룹을 저장한 뒤에 설정할 수 있다 */}
                  <DangerButton small onClick={() => onDelete2(i)}>
                    삭제
                  </DangerButton>
                </Cell>
              </TRow>
            ))}
          </TBody>
        </Table>
        <div className='mt-2'>
          <PrimaryButton onClick={handleAddNewRow}>
            고객 그룹 추가
          </PrimaryButton>
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          저장
        </PrimaryButton>
      </DialogActions>

      <GroupPriceModal
        open={openGroupPrice}
        setOpen={setOpenGroupPrice}
        group={priceTargetGroup}
      />

      {/* 설정 화면의 그릇수거 시간 팝업을 그대로 쓰되, 이 행의 그룹으로 고정해서 연다 */}
      <DisposalTimeModal
        open={openDisposalTime}
        setOpen={setOpenDisposalTime}
        fixedGroupId={disposalTargetGroup?.id}
        fixedGroupName={disposalTargetGroup?.name}
      />
    </Dialog>
  )
}

/** API 의 백원 단위 적립을 화면용 원 단위로 바꾼다 */
function toDisplay(groups: DiscountGroupExt[]): DiscountGroupExt[] {
  return groups.map(group => ({
    ...group,
    rewardPerMenu: group.rewardPerMenu === null ? null : pointToWon(group.rewardPerMenu),
    rewardPerBowl: group.rewardPerBowl === null ? null : pointToWon(group.rewardPerBowl),
  }));
}
