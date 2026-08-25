import FormControl from "@src/components/atoms/FormControl.tsx";
import {SecondaryButton} from "@src/components/atoms/Buttons.tsx";

export interface TimeSegment {
  /** 요일 1=월 … 7=일 */
  sml: number;
  name: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

/** 시작·종료 네 칸만 담는 형태 (일괄 입력용) */
export type TimeRange = Pick<TimeSegment, 'startHour' | 'startMinute' | 'endHour' | 'endMinute'>;

export const EMPTY_RANGE: TimeRange = { startHour: '', startMinute: '', endHour: '', endMinute: '' };

/** 일괄 입력 구간. prefillSml 요일의 현재 값으로 입력칸을 미리 채운다 */
export const BULK_GROUPS = [
  { label: '월~목', smls: [1, 2, 3, 4], prefillSml: 1 },
  { label: '금~토', smls: [5, 6], prefillSml: 5 },
  { label: '일', smls: [7], prefillSml: 7 },
];

export const EMPTY_BULK_RANGES: TimeRange[] = BULK_GROUPS.map(() => EMPTY_RANGE);

/** 일괄 입력칸을 각 구간 첫 요일의 현재 값으로 채워 지금 설정을 그대로 보여준다 */
export function toBulkRanges(segments: TimeSegment[]): TimeRange[] {
  return BULK_GROUPS.map(group => toRange(segments.find(row => row.sml === group.prefillSml)));
}

/** 서버가 준 'HH:MM~HH:MM' 문자열을 네 칸으로 쪼갠다. 미설정이면 빈 칸 */
export function toSegments(
  rows: { sml: number, name: string, stringValue: string | null }[],
): TimeSegment[] {
  return rows.map(row => {
    const parts = (row.stringValue ?? '').split(/[:~]/g);

    return {
      sml: row.sml,
      name: row.name,
      startHour: parts[0] ?? '',
      startMinute: parts[1] ?? '',
      endHour: parts[2] ?? '',
      endMinute: parts[3] ?? '',
    };
  });
}

export function toRange(segment: TimeSegment | undefined): TimeRange {
  if (!segment) {
    return EMPTY_RANGE;
  }

  const { startHour, startMinute, endHour, endMinute } = segment;
  return { startHour, startMinute, endHour, endMinute };
}

interface WeekdayTimeEditorProps {
  segments: TimeSegment[];
  setSegments: (segments: TimeSegment[]) => void;
  /** BULK_GROUPS 순서와 같은 길이의 일괄 입력값 */
  bulkRanges: TimeRange[];
  setBulkRanges: (ranges: TimeRange[]) => void;
  /** 요일 칸 위에 띄울 설명 */
  description: React.ReactNode;
  onChanged?: () => void;
}

/**
 * 요일별 시간 범위 편집기 (월~목·금~토·일 일괄 입력 포함).
 *
 * 그릇수거 시간과 메뉴 판매시간이 같은 형식('HH:MM~HH:MM', 자정 넘김 허용)을 쓰므로
 * 두 화면이 이 컴포넌트를 공유한다.
 */
export default function WeekdayTimeEditor(props: WeekdayTimeEditorProps) {
  const setField = (index: number, key: keyof TimeSegment, value: string) => {
    if (value.length > 2) {
      return;
    }

    props.onChanged?.();
    props.setSegments(props.segments.map((segment, i) =>
      i === index ? { ...segment, [key]: value } : segment
    ));
  };

  /** 구간 칸에 넣은 시간을 해당 요일들에 한 번에 채운다 */
  const applyRange = (smls: number[], range: TimeRange) => {
    props.onChanged?.();
    props.setSegments(props.segments.map(segment =>
      smls.includes(segment.sml) ? { ...segment, ...range } : segment
    ));
  };

  return (
    <>
      <div className='card px-3 py-2 mb-3'>
        <p className='mb-2'>
          요일 일괄 입력
          <br />
          <small className='text-muted'>
            채우기를 누르면 아래 요일 칸이 한 번에 바뀝니다. 특정 요일만 다르면 아래에서 따로 고치세요.
          </small>
        </p>
        {BULK_GROUPS.map((group, i) =>
          <BulkRangeRow
            key={group.label}
            label={group.label}
            range={props.bulkRanges[i] ?? EMPTY_RANGE}
            setRange={range => props.setBulkRanges(props.bulkRanges.map((r, j) => j === i ? range : r))}
            onApply={() => applyRange(group.smls, props.bulkRanges[i] ?? EMPTY_RANGE)}
          />
        )}
      </div>

      <p className='mb-3'>{props.description}</p>

      {props.segments.map((segment, i) =>
        <div key={i} className='d-flex my-2'>
          <div className='me-4 my-auto' style={{ width: 60 }}>{segment.name}</div>
          <div className='d-flex w-100'>
            <FormControl
              type='number'
              style={{width: 45}}
              value={segment.startHour}
              onChange={e => setField(i, 'startHour', e.target.value)}
            />
            <div className='my-auto mx-2'>:</div>
            <FormControl
              type='number'
              style={{width: 45}}
              value={segment.startMinute}
              onChange={e => setField(i, 'startMinute', e.target.value)}
            />
            <div className='my-auto mx-2'>~</div>
            <FormControl
              type='number'
              style={{width: 45}}
              value={segment.endHour}
              onChange={e => setField(i, 'endHour', e.target.value)}
            />
            <div className='my-auto mx-2'>:</div>
            <FormControl
              type='number'
              style={{width: 45}}
              value={segment.endMinute}
              onChange={e => setField(i, 'endMinute', e.target.value)}
            />
          </div>
        </div>
      )}
    </>
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
