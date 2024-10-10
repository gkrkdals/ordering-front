import {Setting} from "@src/models/manager/setting.ts";
import {useEffect, useState} from "react";
import client from "@src/utils/client.ts";
import {formatCurrency} from "@src/utils/data.ts";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";

interface StandardInfoProps {
  imgSource: string | null;
  settings: Setting[];
}

export default function StandardInfo({ imgSource, settings }: StandardInfoProps) {
  const [credit, setCredit] = useState<number>(0);
  const customer = useRecoilValue(customerState);
  useEffect(() => {
    client
      .get('/api/order/credit')
      .then(res => setCredit(res.data))
  }, []);

  return (
    <>
      {imgSource && <img src={imgSource} alt="넘버원푸드 로고" style={{width: '100%'}}/>}
      {settings.map(setting => (
        <div className='d-flex justify-content-between' key={setting.sml}>
          <div className='text-secondary'>{setting.name}</div>
          <div>{setting.stringValue}</div>
        </div>
      ))}
      <div className='mt-3 d-flex justify-content-between'>
        <div className='text-secondary'>상호</div>
        <div>{customer?.name}</div>
      </div>
      <div className='d-flex justify-content-between'>
        <div className='text-secondary'>주소</div>
        <div>{customer?.address}</div>
      </div>
      <div className='d-flex justify-content-between'>
        <div className='text-secondary'>잔금</div>
        <div>{formatCurrency(credit * -1)}</div>
      </div>
    </>
  );
}