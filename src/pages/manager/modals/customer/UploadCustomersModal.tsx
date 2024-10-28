import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, {useState} from "react";
import client from "@src/utils/network/client.ts";
import FormControl from "@src/components/atoms/FormControl.tsx";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";

interface UploadCustomersModalProps extends BasicModalProps {}

export default function UploadCustomersModal(props: UploadCustomersModalProps) {
  const [customerExcel, setCustomerExcel] = useState<File | null>(null);

  function handleSetFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setCustomerExcel(e.target.files[0]);
    }
  }

  async function handleUpload() {
    if (customerExcel) {
      const formData = new FormData();
      formData.append("excel", customerExcel);
      await client.post("/api/manager/customer/excel", formData, {
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
        고객 엑셀 업로드
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