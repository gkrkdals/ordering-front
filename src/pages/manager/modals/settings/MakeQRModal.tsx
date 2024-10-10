import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {QRCodeCanvas} from "qrcode.react";
import {useContext, useEffect, useState} from "react";
import {CustomerContext} from "@src/contexts/manager/CustomerContext.tsx";
import SelectCustomer from "@src/components/molecules/SelectCustomer.tsx";
import client, {baseUrl} from "@src/utils/client.ts";

interface MakeQrModalProps extends BasicModalProps {

}


export default function MakeQRModal(props: MakeQrModalProps) {

  const [imgSource, setImgSource] = useState<string | null>(null);
  const [customer, ] = useContext(CustomerContext)!;
  const [selectedCustomer, setSelectedCustomer] = useState<number>(-1);

  const [qrData, setQRData] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  function initialize() {
    setSelectedCustomer(-1);
    setQRData('');
    setCustomerName('');
    setAddress('')
  }

  function handleCancel() {
    props.setOpen(false);
    initialize();
  }

  function handleMakeQRCode() {
    if (selectedCustomer != -1) {
      setQRData(`${baseUrl}/client?id=${selectedCustomer}`);
      const foundCustomer = customer.find(c => c.id === selectedCustomer)!;
      setCustomerName(foundCustomer.name);
      setAddress(`${foundCustomer.address} (${foundCustomer.floor})`);
    }
  }

  useEffect(() => {
    client
      .get('/api/settings/logo', {
        responseType: 'blob'
      })
      .then(res => {
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onload = () => {
          setImgSource(reader.result as string);
        }
      });
  }, []);

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        QR코드 생성
      </DialogTitle>
      <DialogContent>
        <div className={`border border-4 rounded border-danger px-2 py-3 ${customerName === '' ? 'd-none' : ''}`}>
          <div className='d-flex justify-content-center'>
            {imgSource && <img src={imgSource} alt='넘버원푸드 로고' style={{maxWidth: 50}}/>}
          </div>
          <div className='d-flex justify-content-center mt-2'>
            {qrData !== '' && <QRCodeCanvas value={qrData}/>}
          </div>
          <div className='d-flex justify-content-center mt-1'>
            {customerName !== '' && (<p className='m-0'>{customerName}</p>)}
          </div>
          <div className='d-flex justify-content-center mt-1'>
            {address !== '' && (<p className='m-0'>{address}</p>)}
          </div>
        </div>
        <div className='mt-4'/>
        <SelectCustomer uniqueId={'qrcodecustomer'} customers={customer} setSelectedCustomer={setSelectedCustomer}/>

      </DialogContent>
      <DialogActions>
        <div className='d-flex justify-content-between mt-2' style={{width: '100%'}}>
          <PrimaryButton onClick={handleMakeQRCode}>
            생성
          </PrimaryButton>
          <SecondaryButton onClick={handleCancel}>
            닫기
          </SecondaryButton>
        </div>
      </DialogActions>
    </Dialog>
  )
}