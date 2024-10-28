import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import React, {useState} from "react";
import FormControl from "@src/components/atoms/FormControl.tsx";
import client from "@src/utils/network/client.ts";

interface UploadMenusModalProps extends BasicModalProps {

}

export default function UploadMenusModal(props: UploadMenusModalProps) {

  const [menuExcel, setMenuExcel] = useState<File | null>(null);

  function handleSetFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setMenuExcel(e.target.files[0]);
    }
  }

  async function handleUpload() {
    if (menuExcel) {
      const formData = new FormData();
      formData.append("excel", menuExcel);
      await client.post("/api/manager/menu/excel", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    }
    props.setOpen(false);
    window.dispatchEvent(new CustomEvent('reload'));
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        메뉴 엑셀 업로드
      </DialogTitle>
      <DialogContent>
        <div className='mt-1' />
        <FormControl type='file' onChange={handleSetFile} accept='.xls, .xlsx' />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleUpload}>
          업로드
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}