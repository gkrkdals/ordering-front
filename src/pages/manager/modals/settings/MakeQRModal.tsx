import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {QRCodeCanvas} from "qrcode.react";
import {useContext, useState} from "react";
import {CustomerContext} from "@src/contexts/manager/CustomerContext.tsx";
import SelectCustomer from "@src/components/molecules/SelectCustomer.tsx";
import {baseUrl} from "@src/utils/client.ts";

interface MakeQrModalProps extends BasicModalProps {

}


export default function MakeQRModal(props: MakeQrModalProps) {

  const [customer, ] = useContext(CustomerContext)!;
  const [selectedCustomer, setSelectedCustomer] = useState<number>(-1);
  const [qrData, setQRData] = useState<string>('');

  function initialize() {
    setSelectedCustomer(-1);
    setQRData('');
  }

  function handleCancel() {
    props.setOpen(false);
    initialize();
  }

  function handleMakeQRCode() {
    if (selectedCustomer != -1) {
      setQRData(`${baseUrl}?id=${selectedCustomer}`);
    }
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        QR코드 생성
      </DialogTitle>
      <DialogContent>
        <div className='my-3 mx-4'>
          <SelectCustomer uniqueId={'qrcodecustomer'} customers={customer} setSelectedCustomer={setSelectedCustomer} />
          <div className='mt-3 d-flex justify-content-center'>
            <PrimaryButton onClick={handleMakeQRCode}>
              생성
            </PrimaryButton>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          {qrData !== '' && <QRCodeCanvas value={qrData} />}
        </div>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleCancel}>
          닫기
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  )
}