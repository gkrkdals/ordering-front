import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import {DisposalTimeSetting} from "@src/models/manager/settings.ts";
import client from "@src/utils/network/client.ts";
import FormControl from "@src/components/atoms/FormControl.tsx";
import GroupSelect, {GLOBAL_GROUP_ID} from "@src/pages/manager/components/molecules/GroupSelect.tsx";

interface TimeSegment {
  sml: number;
  name: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

/** 시작·종료 네 칸만 담는 형태 (일괄 입력용) */
type TimeRange = Pick<TimeSegment, 'startHour' | 'startMinute' | 'endHour' | 'endMinute'>;

const EMPTY_RANGE: TimeRange = { startHour: '', startMinute: '', endHour: '', endMinute: '' };

/** sml 1=월 … 7=일 */
const WEEKDAY_SMLS = [1, 2, 3, 4, 5];
const WEEKEND_SMLS = [6, 7];

interface DisposalTimeModalProps extends BasicModalProps {
  /**
   * 특정 그룹의 설정만 편집할 때 지정한다. (고객 그룹 설정에서 바로 여는 경우)
   * 주면 그룹 선택 드롭다운 대신 그룹명을 보여주고 그 그룹으로 고정한다.
   */
  fixedGroupId?: number;
  fixedGroupName?: string;
}

export default function DisposalTimeModal(props: DisposalTimeModalProps) {

  const [disposalTimes, setDisposalTimes] = useState<TimeSegment[]>([]);
  const [isPerforming, setIsPerforming] = useState(false);
  const [warning, setWarning] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number>(GLOBAL_GROUP_ID);
  const [usingGlobal, setUsingGlobal] = useState(false);

  // 그룹이 고정된 경우(고객 그룹 설정에서 연 경우)에는 드롭다운 선택값을 무시한다
  const groupId = props.fixedGroupId ?? selectedGroupId;

  // 주중·주말을 한 번에 채우기 위한 입력값. 실제 저장 대상은 아래 요일별 7행이다.
  const [weekdayRange, setWeekdayRange] = useState<TimeRange>(EMPTY_RANGE);
  const [weekendRange, setWeekendRange] = useState<TimeRange>(EMPTY_RANGE);

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

  /** 주중(월~금) 또는 주말(토·일) 칸에 입력한 시간을 해당 요일들에 한 번에 채운다 */
  const applyRange = (smls: number[], range: TimeRange) => {
    setWarning('');
    setDisposalTimes(disposalTimes.map(disposalTime =>
      smls.includes(disposalTime.sml) ? { ...disposalTime, ...range } : disposalTime
    ));
  };

  const handleSave = async () => {
    setIsPerforming(true);
    try {
      await client.put('/api/manager/settings/disposal-time', { days: disposalTimes, groupId });
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
        .get('/api/manager/settings/disposal-time', { params: { groupId } })
        .then(res => {
          const data = res.data as DisposalTimeSetting[];
          // 그룹 전용 행이 없으면 서버가 전역 값을 내려준다
          setUsingGlobal(data.every(row => (row.groupId ?? GLOBAL_GROUP_ID) === GLOBAL_GROUP_ID));

          const parsed = data.map(disposalTime => {
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
          });

          setDisposalTimes(parsed);
          // 일괄 입력칸은 월요일·토요일 값으로 채워 지금 설정을 그대로 보여준다
          setWeekdayRange(toRange(parsed.find(row => row.sml === 1)));
          setWeekendRange(toRange(parsed.find(row => row.sml === 6)));
        })
        .catch(() => {
          setDisposalTimes([]);
          setWeekdayRange(EMPTY_RANGE);
          setWeekendRange(EMPTY_RANGE);
          setWarning('설정을 불러오지 못했습니다.');
        });
    }
  }, [props.open, groupId]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>그릇 수거 요청 시간 설정</DialogTitle>
      <DialogContent>
        {
          props.fixedGroupId === undefined
            ? <GroupSelect value={groupId} onChange={setSelectedGroupId} usingGlobal={usingGlobal} />
            : (
              <div className='mb-3'>
                <p className='mb-1'>고객 그룹</p>
                <p className='mb-0' style={{ fontWeight: 'bold' }}>{props.fixedGroupName}</p>
                {
                  usingGlobal &&
                  <p className='text-secondary mt-1 mb-0' style={{ fontSize: '0.85em' }}>
                    이 그룹만의 설정이 아직 없어 전체 공통 값을 보여주는 중입니다. 저장하면 이 그룹 전용 설정이 만들어집니다.
                  </p>
                }
              </div>
            )
        }

        <div className='card px-3 py-2 mb-3'>
          <p className='mb-2'>
            주중·주말 일괄 입력
            <br />
            <small className='text-muted'>
              채우기를 누르면 아래 요일 칸이 한 번에 바뀝니다. 특정 요일만 다르면 아래에서 따로 고치세요.
            </small>
          </p>
          <BulkRangeRow
            label='주중(월~금)'
            range={weekdayRange}
            setRange={setWeekdayRange}
            onApply={() => applyRange(WEEKDAY_SMLS, weekdayRange)}
          />
          <BulkRangeRow
            label='주말(토·일)'
            range={weekendRange}
            setRange={setWeekendRange}
            onApply={() => applyRange(WEEKEND_SMLS, weekendRange)}
          />
        </div>

        <p className='mb-3'>
          요일별로 그릇 수거 요청이 가능한 시간을 설정하세요.
          <br />
          <small className='text-muted'>빈 칸으로 두면 그 요일은 종일 수거 가능합니다.</small>
        </p>

        {disposalTimes.map((disposalTime, i) =>
          <div key={i} className='d-flex my-2'>
            <div className='me-4 my-auto' style={{ width: 60 }}>{disposalTime.name}</div>
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

interface BulkRangeRowProps {
  label: string;
  range: TimeRange;
  setRange: (range: TimeRange) => void;
  onApply: () => void;
}

function BulkRangeRow({ label, range, setRange, onApply }: BulkRangeRowProps) {
  const setField = (key: keyof TimeRange, value: string) => {
    if (value.length > 2) {
      return;
    }

    setRange({ ...range, [key]: value });
  };

  return (
    <div className='d-flex my-2'>
      <div className='me-4 my-auto' style={{ width: 90 }}>{label}</div>
      <div className='d-flex w-100 align-items-center'>
        <FormControl
          type='number'
          style={{width: 45}}
          value={range.startHour}
          onChange={e => setField('startHour', e.target.value)}
        />
        <div className='my-auto mx-2'>:</div>
        <FormControl
          type='number'
          style={{width: 45}}
          value={range.startMinute}
          onChange={e => setField('startMinute', e.target.value)}
        />
        <div className='my-auto mx-2'>~</div>
        <FormControl
          type='number'
          style={{width: 45}}
          value={range.endHour}
          onChange={e => setField('endHour', e.target.value)}
        />
        <div className='my-auto mx-2'>:</div>
        <FormControl
          type='number'
          style={{width: 45}}
          value={range.endMinute}
          onChange={e => setField('endMinute', e.target.value)}
        />
        {/* Buttons 는 props 를 className 뒤에 전개하므로 className 을 넘기면 부트스트랩 클래스가 지워진다 */}
        <SecondaryButton small style={{ whiteSpace: 'nowrap', marginLeft: 12 }} onClick={onApply}>
          채우기
        </SecondaryButton>
      </div>
    </div>
  );
}

function toRange(segment: TimeSegment | undefined): TimeRange {
  if (!segment) {
    return EMPTY_RANGE;
  }

  const { startHour, startMinute, endHour, endMinute } = segment;
  return { startHour, startMinute, endHour, endMinute };
}
