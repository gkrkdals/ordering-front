import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import client from "@src/utils/network/client.ts";
import GroupSelect, {GLOBAL_GROUP_ID} from "@src/pages/manager/components/molecules/GroupSelect.tsx";

export default function WebDiscountModal(props: BasicModalProps) {
  const [value, setValue] = useState<string>('');
  const [groupId, setGroupId] = useState<number>(GLOBAL_GROUP_ID);

  function initialize() {
    setValue('');
    setGroupId(GLOBAL_GROUP_ID);
  }

  function handleClose() {
    props.setOpen(false);
    setTimeout(initialize, 300);
  }

  async function handleSave() {
    await client.put("/api/manager/settings/discount", { value: parseFloat(value) * 1000, groupId });
    handleClose();
  }

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/settings/discount', { params: { groupId } })
        .then(res => setValue(res.data.toString()));
    }
  }, [props.open, groupId])

  return (
    <Dialog open={props.open}>
      <DialogTitle>웹할인 가격 설정</DialogTitle>
      <DialogContent>
        <GroupSelect value={groupId} onChange={setGroupId} />
        <p>단위: 천원</p>
        <FormControl
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>닫기</SecondaryButton>
        <PrimaryButton onClick={handleSave}>저장</PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}