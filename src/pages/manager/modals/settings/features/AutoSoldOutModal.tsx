import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import {Settings} from "@src/models/manager/settings.ts";
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

export default function AutoSoldOutModal(props: BasicModalProps) {

  const [businessHours, setBusinessHours] = useState<TimeSegment[]>([]);
  const set = (index: number, key: keyof TimeSegment, value: TimeSegment[keyof TimeSegment]) => {
    setBusinessHours(businessHours.map((businessHour, i) => {
      if (index === i) {
        businessHour[key] = value as never;
      }

      return businessHour;
    }))
  };

  const setField = (index: number, key: keyof TimeSegment, value: TimeSegment[keyof TimeSegment]) => {
    if ((value as string).length > 2) {
      return;
    }

    set(index, key, value);
  };

  const handleSave = async () => {
    await client.put('/api/manager/settings/hour', businessHours);
    props.setOpen(false);
  };

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/settings/hour')
        .then(res => {
          const data = res.data as Settings[];
          setBusinessHours(data.map(hours => {
            const timeSegments = hours.stringValue.split(/[:~]/g);

            return {
              sml: hours.sml,
              name: hours.name,
              startHour: timeSegments[0],
              startMinute: timeSegments[1],
              endHour: timeSegments[2],
              endMinute: timeSegments[3]
            };
          }))
        });
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        {businessHours.map((hour, i) =>
          <div key={i} className='d-flex my-2'>
            <div className='me-4 my-auto'>{hour.name}</div>
            <div className='d-flex w-100'>
              <FormControl
                type='number'
                style={{width: 45}}
                value={hour.startHour}
                onChange={e => setField(i, 'startHour', e.target.value)}
              />
              <div className='my-auto mx-2'>:</div>
              <FormControl
                type='number'
                style={{width: 45}}
                value={hour.startMinute}
                onChange={e => setField(i, 'startMinute', e.target.value)}
              />
              <div className='my-auto mx-2'>~</div>
              <FormControl
                type='number'
                style={{width: 45}}
                value={hour.endHour}
                onChange={e => setField(i, 'endHour', e.target.value)}
              />
              <div className='my-auto mx-2'>:</div>
              <FormControl
                type='number'
                style={{width: 45}}
                value={hour.endMinute}
                onChange={e => setField(i, 'endMinute', e.target.value)}
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          저장
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}