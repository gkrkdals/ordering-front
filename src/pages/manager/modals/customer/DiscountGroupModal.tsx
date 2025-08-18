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

interface DiscountGroupModalProps extends BasicModalProps {}

export default function DiscountGroupModal(props: DiscountGroupModalProps) {


  const [modifiedDiscountGroups, setModifiedDiscountGroups] = useState<DiscountGroupExt[]>([]);
  const [addedDiscountGroups, setAddedDiscountGroups] = useState<DiscountGroupExt[]>([]);
  const [, setDiscountGroups] = useContext(DiscountGroupContext)!;

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

  async function handleSave() {
    await client.put('/api/manager/customer/discount-group', {
      modified: modifiedDiscountGroups,
      added: addedDiscountGroups,
    });
    handleClose();
    const res = await client.get('/api/manager/customer/discount-group');
    setDiscountGroups(res.data);
  }

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/customer/discount-group')
        .then(res => setModifiedDiscountGroups(res.data));
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
        할인 그룹 설정
      </DialogTitle>
      <DialogContent style={{width: '100%'}}>
        <Table>
          <THead>
            <TRow>
              <Cell style={{ width: 180 }}>그룹명</Cell>
              <Cell style={{ width: 130 }}>유형</Cell>
              <Cell style={{ width: 100 }}>할인값</Cell>
              <Cell>비고</Cell>
              <Cell style={{ width: 80 }}></Cell>
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
                    value={discountGroup.description}
                    onChange={e => onChange1(i, 'description', e.target.value)}
                  />
                </Cell>
                <Cell>
                  <DangerButton onClick={() => onDelete1(i)}>
                    삭제
                  </DangerButton>
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
                    value={discountGroup.description}
                    onChange={e => onChange2(i, 'description', e.target.value)}
                  />
                </Cell>
                <Cell>
                  <DangerButton onClick={() => onDelete2(i)}>
                    삭제
                  </DangerButton>
                </Cell>
              </TRow>
            ))}
          </TBody>
        </Table>
        <div className='mt-2'>
          <PrimaryButton onClick={handleAddNewRow}>
            할인 그룹 추가
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
    </Dialog>
  )
}