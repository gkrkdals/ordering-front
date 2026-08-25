import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import Menu from "@src/models/common/Menu.ts";
import {GLOBAL_GROUP_ID} from "@src/pages/manager/components/molecules/GroupSelect.tsx";
import WeekdayTimeEditor, {
  EMPTY_RANGE,
  TimeRange,
  TimeSegment,
  toRange,
  toSegments,
} from "@src/pages/manager/components/molecules/WeekdayTimeEditor.tsx";

interface MenuScheduleRow {
  sml: number;
  name: string;
  groupId: number;
  stringValue: string | null;
}

interface MenuScheduleModalProps extends BasicModalProps {
  menu: Menu | null;
  /** 어느 그룹의 판매시간을 편집하는지 (메뉴 탭에서 고른 그룹) */
  groupId: number;
  groupName: string;
}

/**
 * 메뉴별 판매 가능 시간 설정.
 *
 * 비워두면 그 요일은 시간 제약이 없습니다. 설정한 시간 밖에는 자동으로 품절 처리되며,
 * 이때는 메뉴 탭에서 수동으로 판매중으로 돌려도 팔리지 않습니다.
 */
export default function MenuScheduleModal(props: MenuScheduleModalProps) {
  const [segments, setSegments] = useState<TimeSegment[]>([]);
  const [weekdayRange, setWeekdayRange] = useState<TimeRange>(EMPTY_RANGE);
  const [weekendRange, setWeekendRange] = useState<TimeRange>(EMPTY_RANGE);
  const [usingGlobal, setUsingGlobal] = useState(false);
  const [isPerforming, setIsPerforming] = useState(false);
  const [warning, setWarning] = useState('');

  async function handleSave() {
    if (!props.menu) {
      return;
    }

    setIsPerforming(true);
    try {
      await client.put('/api/manager/menu/schedule', {
        menu: props.menu.id,
        days: segments,
        groupId: props.groupId,
      });
      props.setOpen(false);
    } catch {
      setWarning('저장에 실패했습니다.');
    } finally {
      setIsPerforming(false);
    }
  }

  useEffect(() => {
    if (!props.open || !props.menu) {
      return;
    }

    setWarning('');
    client
      .get('/api/manager/menu/schedule', {
        params: { menu: props.menu.id, groupId: props.groupId },
      })
      .then(res => {
        const rows = res.data as MenuScheduleRow[];
        // 그룹 전용 행이 없으면 서버가 전역 값을 대신 내려준다
        setUsingGlobal(rows.every(row => (row.groupId ?? GLOBAL_GROUP_ID) === GLOBAL_GROUP_ID));

        const parsed = toSegments(rows);
        setSegments(parsed);
        // 일괄 입력칸은 월요일·토요일 값으로 채워 지금 설정을 그대로 보여준다
        setWeekdayRange(toRange(parsed.find(row => row.sml === 1)));
        setWeekendRange(toRange(parsed.find(row => row.sml === 6)));
      })
      .catch(() => {
        setSegments([]);
        setWarning('설정을 불러오지 못했습니다.');
      });
  }, [props.open, props.menu?.id, props.groupId]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>판매시간 설정 — {props.menu?.name}</DialogTitle>
      <DialogContent>
        <div className='mb-3'>
          <p className='mb-1'>고객 그룹</p>
          <p className='mb-0' style={{ fontWeight: 'bold' }}>{props.groupName}</p>
          {
            props.groupId !== GLOBAL_GROUP_ID && usingGlobal &&
            <p className='text-secondary mt-1 mb-0' style={{ fontSize: '0.85em' }}>
              이 그룹만의 판매시간이 아직 없어 전체 공통 값을 보여주는 중입니다. 저장하면 이 그룹 전용 설정이 만들어집니다.
            </p>
          }
        </div>

        <WeekdayTimeEditor
          segments={segments}
          setSegments={setSegments}
          weekdayRange={weekdayRange}
          setWeekdayRange={setWeekdayRange}
          weekendRange={weekendRange}
          setWeekendRange={setWeekendRange}
          onChanged={() => setWarning('')}
          description={
            <>
              이 메뉴를 판매할 시간을 요일별로 정하세요.
              <br />
              <small className='text-muted'>
                빈 칸으로 두면 그 요일은 시간 제한 없이 판매합니다.
              </small>
            </>
          }
        />

        <small className='text-muted d-block mt-3'>
          설정한 시간 밖에는 자동으로 품절 처리되며, 메뉴 목록에서 수동으로 판매중으로 돌려도 팔리지 않습니다.
          <br />
          예: 금요일에 23시 → 02시를 입력하면 금요일 23시부터 토요일 새벽 2시까지 판매합니다.
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
