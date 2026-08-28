import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@src/components/atoms/Buttons.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import client from "@src/utils/network/client.ts";
import GroupSelect, {GLOBAL_GROUP_ID} from "@src/pages/manager/components/molecules/GroupSelect.tsx";

/** 적립금 사용 단위(원). 서버의 POINT_USE_UNIT과 같은 고정값입니다. */
const POINT_USE_UNIT = 1000;

export default function MinUsePointModal(props: BasicModalProps) {
  const [minValue, setMinValue] = useState<string>('');
  const [groupId, setGroupId] = useState<number>(GLOBAL_GROUP_ID);

  function initialize() {
    setMinValue('');
    setGroupId(GLOBAL_GROUP_ID);
  }

  function handleClose() {
    props.setOpen(false);
    setTimeout(initialize, 300);
  }

  async function handleSave() {
    const minUsePoint = parseInt(minValue, 10);

    // 사용 단위가 1,000원이므로 최소 금액도 1,000원 단위여야 합니다.
    if (isNaN(minUsePoint) || minUsePoint <= 0 || minUsePoint % POINT_USE_UNIT !== 0) {
      alert(`최소 사용 금액은 ${POINT_USE_UNIT.toLocaleString()}원 단위로 입력해주세요.`);
      return;
    }

    await client.put("/api/manager/settings/point-use-policy", { minUsePoint, groupId });
    handleClose();
  }

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/settings/point-use-policy', { params: { groupId } })
        .then(res => {
          setMinValue(res.data.minUsePoint.toString());
        });
    }
  }, [props.open, groupId]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>적립금 사용 설정</DialogTitle>
      <DialogContent>
        <GroupSelect value={groupId} onChange={setGroupId} />
        {/*<p className='mb-1'>최소 사용 금액 (원, {POINT_USE_UNIT.toLocaleString()}원 단위)</p>*/}
        <FormControl
          type="number"
          value={minValue}
          onChange={e => setMinValue(e.target.value)}
          placeholder="예: 3000"
        />

        {/*<p className='text-secondary mt-3 mb-0'>*/}
        {/*  고객 화면 안내: "{(parseInt(minValue, 10) || 0).toLocaleString()}원 이상 {POINT_USE_UNIT.toLocaleString()}원단위"*/}
        {/*</p>*/}
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>닫기</SecondaryButton>
        <PrimaryButton onClick={handleSave}>저장</PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}
