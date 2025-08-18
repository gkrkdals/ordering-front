import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "@src/components/atoms/Buttons";
import BasicModalProps from "@src/interfaces/BasicModalProps";
import { useState } from "react";

export default function MenuCategoryModal(props: BasicModalProps) {

  const [modifiedCategories, setModifiedCategories] = useState<any>([]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>메뉴 카테고리 설정</DialogTitle>
      <DialogContent>

      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={() => props.setOpen(false)}>
          저장
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}