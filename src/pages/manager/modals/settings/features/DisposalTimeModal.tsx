import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import {DisposalTimeSetting} from "@src/models/manager/settings.ts";
import client from "@src/utils/network/client.ts";
import FormControl from "@src/components/atoms/FormControl.tsx";

interface TimeSegment {
  sml: number;
  name: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

export default function DisposalTimeModal(props: BasicModalProps) {

  const [disposalTimes, setDisposalTimes] = useState<TimeSegment[]>([]);
  const [isPerforming, setIsPerforming] = useState(false);
  const [warning, setWarning] = useState('');

  const set = (index: number, key: keyof TimeSegment, value: TimeSegment[keyof TimeSegment]) => {
    setDisposalTimes(disposalTimes.map((disposalTime, i) => {
      if (index === i) {
        disposalTime[key] = value as never;
      }

      return disposalTime;
    }))
  };

  const setField = (index: number, key: keyof TimeSegment, value: TimeSegment[keyof TimeSegment]) => {
    if ((value as string).length > 2) {
      return;
    }

    setWarning('');
    set(index, key, value);
  };

  const handleSave = async () => {
    setIsPerforming(true);
    try {
      await client.put('/api/manager/settings/disposal-time', disposalTimes);
      props.setOpen(false);
    } catch {
      setWarning('저장에 실패했습니다.');
    } finally {
      setIsPerforming(false);
    }
  };

  useEffect(() => {
    if (props.open) {
      setWarning('');
      client
        .get('/api/manager/settings/disposal-time')
        .then(res => {
          const data = res.data as DisposalTimeSetting[];
          setDisposalTimes(data.map(disposalTime => {
            // 미설정 요일은 stringValue 가 null 이므로 빈 칸으로 표시합니다.
            const timeSegments = (disposalTime.stringValue ?? '').split(/[:~]/g);

            return {
              sml: disposalTime.sml,
              name: disposalTime.name,
              startHour: timeSegments[0] ?? '',
              startMinute: timeSegments[1] ?? '',
              endHour: timeSegments[2] ?? '',
              endMinute: timeSegments[3] ?? ''
            };
          }));
        })
        .catch(() => {
          setDisposalTimes([]);
          setWarning('설정을 불러오지 못했습니다.');
        });
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>그릇 수거 요청 시간 설정</DialogTitle>
      <DialogContent>
        <p className='mb-3'>
          요일별로 그릇 수거 요청이 가능한 시간을 설정하세요.
          <br />
          <small className='text-muted'>빈 칸으로 두면 그 요일은 종일 수거 가능합니다.</small>
        </p>

        {disposalTimes.map((disposalTime, i) =>
          <div key={i} className='d-flex my-2'>
            <div className='me-4 my-auto'>{disposalTime.name}</div>
            <div className='d-flex w-100'>
              <FormControl
                type='number'
                style={{width: 45}}
                value={disposalTime.startHour}
                onChange={e => setField(i, 'startHour', e.target.value)}
              />
              <div className='my-auto mx-2'>:</div>
              <FormControl
                type='number'
                style={{width: 45}}
                value={disposalTime.startMinute}
                onChange={e => setField(i, 'startMinute', e.target.value)}
              />
              <div className='my-auto mx-2'>~</div>
              <FormControl
                type='number'
                style={{width: 45}}
                value={disposalTime.endHour}
                onChange={e => setField(i, 'endHour', e.target.value)}
              />
              <div className='my-auto mx-2'>:</div>
              <FormControl
                type='number'
                style={{width: 45}}
                value={disposalTime.endMinute}
                onChange={e => setField(i, 'endMinute', e.target.value)}
              />
            </div>
          </div>
        )}

        <small className='text-muted d-block mt-3'>
          예: 금요일에 23시 → 02시를 입력하면 금요일 23시부터 토요일 새벽 2시까지 적용됩니다.
        </small>

        {warning && (
          <div className='alert alert-danger mt-3 mb-0' role='alert'>
            {warning}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)} disabled={isPerforming}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={isPerforming}>
          {isPerforming ? '저장 중' : '저장'}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}