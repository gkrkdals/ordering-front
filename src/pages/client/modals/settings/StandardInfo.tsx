import {Settings} from "@src/models/manager/settings.ts";
import {useEffect, useMemo, useState} from "react";
import client from "@src/utils/network/client.ts";
import {useRecoilValue} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import {BigColumn, Column, SmallColumn} from "@src/components/atoms/Columns.tsx";
import {formatCurrency} from "@src/utils/data.ts";

interface StandardInfoProps {
  imgSource: string | null;
  settings: Settings[];
}

export default function StandardInfo({ imgSource, settings }: StandardInfoProps) {
  const [credit, setCredit] = useState<number>(0);
  const customer = useRecoilValue(customerState);

  const bankAccount = useMemo(() => {
    const p = settings.find(setting => setting.sml === 3)?.stringValue;

    if (p) {
      const tmp = p.split(' ');
      if (tmp.length > 1) {
        return tmp[1].trim();
      } else {
        return tmp[0].trim();
      }
    }

    return '';
  }, [settings]);

  useEffect(() => {
    client
      .get('/api/order/credit')
      .then(res => setCredit(res.data))
  }, []);

  return (
    <>
      {imgSource && <img src="/logo_horizontal.png" alt="넘버원푸드 로고" style={{width: '100%'}}/>}
      <div className='mb-3'/>
      <div className='d-flex justify-content-between align-items-center' style={{fontSize: '1.4em'}}>
        <img src="/uri.png" alt="우리은행 로고" style={{width: 50}}/>
        {bankAccount}
      </div>
      <div className='mb-3'/>
      {settings[0].stringValue.split(/\//g).map((line, i) => (
        <div key={i} className='d-flex justify-content-center' style={{ fontSize: '1.4em' }}>
          <p className='m-0'>{line.trim()}</p>
        </div>
      ))}
      <div className='mb-2'/>
      <Column style={{fontSize: '1.2em'}}>
        <SmallColumn>
          <div className='text-secondary'>상호</div>
        </SmallColumn>
        <BigColumn>
          <div className='w-100 d-flex justify-content-end'>
            {customer?.name}
          </div>
        </BigColumn>
      </Column>

      <Column style={{fontSize: '1.2em'}}>
        <SmallColumn>
          <div className='text-secondary'>주소</div>
        </SmallColumn>
        <BigColumn>
          <div className='w-100 d-flex justify-content-end'>
            {customer?.address}
          </div>
        </BigColumn>
      </Column>

      <Column style={{fontSize: '1.2em'}}>
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