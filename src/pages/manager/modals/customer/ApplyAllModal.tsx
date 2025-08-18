import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Select from "@src/components/atoms/Select.tsx";
import {useEffect, useState} from "react";
import {DiscountGroup} from "@src/models/manager/DiscountGroup.tsx";
import client from "@src/utils/network/client.ts";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";

interface ApplyAllModalProps extends BasicModalProps {
  reload: () => void;
}

export default function ApplyAllModal(props: ApplyAllModalProps) {
  const [selectedGroup, setSelectedGroup] = useState(-1);
  const [discountGroups, setDiscountGroups] = useState<DiscountGroup[]>([]);

  function initialize() {
    setSelectedGroup(-1);
  }

  function handleClose() {
    props.setOpen(false);
    setTimeout(initialize, 300);
  }

  async function handleSave() {
    await client.put("/api/manager/customer/discount-group/all", {
      groupId: selectedGroup
    });
    props.setOpen(false);
    props.reload();
  }

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/customer/discount-group')
        .then(res => setDiscountGroups(res.data));
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        그룹 전체 적용
      </DialogTitle>
      <DialogContent>
        <p className='text-secondary'>
          전체 거래처에 대해 적용할 할인 그룹을 선택하세요.
        </p>
        <Select value={selectedGroup} onChange={e => setSelectedGroup(parseInt(e.target.value))}>
          <option value="-1">
            전체 적용 취소
          </option>
          {discountGroups.map(group => (
            <option key={group.id} value={group.id.toString()}>
              {group.name}
            </option>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>
          취소
        </SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          저장
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}