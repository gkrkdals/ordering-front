import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@src/components/atoms/Buttons.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";
import client from "@src/utils/network/client.ts";

export default function MinUsePointModal(props: BasicModalProps) {
  const [value, setValue] = useState<string>('');

  function initialize() {
    setValue('');
  }

  function handleClose() {
    props.setOpen(false);
    setTimeout(initialize, 300);
  }

  async function handleSave() {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      alert("올바른 값을 입력해주세요.");
      return;
    }
    await client.put("/api/manager/settings/min-use-point", { value: numericValue * 1000 });
    handleClose();
  }

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/settings/min-use-point')
        .then(res => {
          const val = parseFloat(res.data);
          setValue((val / 1000).toString());
        });
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>적립금 하한 설정</DialogTitle>
      <DialogContent>
        <p>단위: 천원 (예: 3 입력 시 3,000원 제한)</p>
        <FormControl
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="천원"
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>닫기</SecondaryButton>
        <PrimaryButton onClick={handleSave}>저장</PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}
