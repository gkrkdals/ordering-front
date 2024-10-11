import {Setting} from "@src/models/manager/setting.ts";
import {useEffect, useState} from "react";
import client from "@src/utils/client.ts";
import {formatCurrency} from "@src/utils/data.ts";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import {BigColumn, Column, SmallColumn} from "@src/components/atoms/Columns.tsx";

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
      <p className='mb-1' style={{fontSize: '1.4em', fontWeight: 'bold'}}>
        기본정보
      </p>
      {imgSource && <img src="/logo_horizontal.png" alt="넘버원푸드 로고" style={{width: '100%'}}/>}
      <div className='mb-3'/>
      {settings.map(setting => (
        // <div className='d-flex justify-content-between' key={setting.sml}>
        //   <div className='text-secondary'>{setting.name}</div>
        //   <div>{setting.stringValue}</div>
        // </div>
        <Column>
          <SmallColumn>
            <div className='text-secondary'>{setting.name}</div>
          </SmallColumn>
          <BigColumn>
            <div className='w-100 d-flex justify-content-end'>
              {setting.stringValue}
            </div>
          </BigColumn>
        </Column>
      ))}
      <Column>
        <SmallColumn>
          <div className='text-secondary'>상호</div>
        </SmallColumn>
        <BigColumn>
          <div className='w-100 d-flex justify-content-end'>
            {customer?.name}
          </div>
        </BigColumn>
      </Column>

      <Column>
        <SmallColumn>
          <div className='text-secondary'>주소</div>
        </SmallColumn>
        <BigColumn>
          <div className='w-100 d-flex justify-content-end'>
            {customer?.address}
          </div>
        </BigColumn>
      </Column>

      <Column>
        <SmallColumn>
          <div className='text-secondary'>잔금</div>
        </SmallColumn>
        <BigColumn>
          <div className='w-100 d-flex justify-content-end'>
            {formatCurrency(credit * -1)}
          </div>
        </BigColumn>
      </Column>
    </>
  );
}