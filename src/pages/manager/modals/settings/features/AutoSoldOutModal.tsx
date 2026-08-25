import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import {Settings} from "@src/models/manager/settings.ts";
import client from "@src/utils/network/client.ts";
import GroupSelect, {GLOBAL_GROUP_ID} from "@src/pages/manager/components/molecules/GroupSelect.tsx";
import WeekdayTimeEditor, {
  EMPTY_RANGE,
  TimeRange,
  TimeSegment,
  toRange,
  toSegments,
} from "@src/pages/manager/components/molecules/WeekdayTimeEditor.tsx";

interface AutoSoldOutModalProps extends BasicModalProps {
  /**
   * 특정 그룹의 설정만 편집할 때 지정한다. (고객 그룹 설정에서 바로 여는 경우)
   * 주면 그룹 선택 드롭다운 대신 그룹명을 보여주고 그 그룹으로 고정한다.
   */
  fixedGroupId?: number;
  fixedGroupName?: string;
}

export default function AutoSoldOutModal(props: AutoSoldOutModalProps) {

  const [businessHours, setBusinessHours] = useState<TimeSegment[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(GLOBAL_GROUP_ID);
  const [usingGlobal, setUsingGlobal] = useState(false);
  const [isPerforming, setIsPerforming] = useState(false);
  const [warning, setWarning] = useState('');

  // 그룹이 고정된 경우(고객 그룹 설정에서 연 경우)에는 드롭다운 선택값을 무시한다
  const groupId = props.fixedGroupId ?? selectedGroupId;

  // 주중·주말을 한 번에 채우기 위한 입력값. 실제 저장 대상은 아래 요일별 7행이다.
  const [weekdayRange, setWeekdayRange] = useState<TimeRange>(EMPTY_RANGE);
  const [weekendRange, setWeekendRange] = useState<TimeRange>(EMPTY_RANGE);

  const handleSave = async () => {
    setIsPerforming(true);
    try {
      await client.put('/api/manager/settings/hour', { hours: businessHours, groupId });
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
        .get('/api/manager/settings/hour', { params: { groupId } })
        .then(res => {
          const data = res.data as Settings[];
          // 그룹 전용 행이 없으면 서버가 전역 값을 내려준다
          setUsingGlobal(data.every(row => (row.groupId ?? GLOBAL_GROUP_ID) === GLOBAL_GROUP_ID));

          const parsed = toSegments(data);
          setBusinessHours(parsed);
          // 일괄 입력칸은 월요일·토요일 값으로 채워 지금 설정을 그대로 보여준다
          setWeekdayRange(toRange(parsed.find(row => row.sml === 1)));
          setWeekendRange(toRange(parsed.find(row => row.sml === 6)));
        })
        .catch(() => {
          setBusinessHours([]);
          setWeekdayRange(EMPTY_RANGE);
          setWeekendRange(EMPTY_RANGE);
          setWarning('설정을 불러오지 못했습니다.');
        });
    }
  }, [props.open, groupId]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>자동 품절/해제 시간 설정</DialogTitle>
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

        <WeekdayTimeEditor
          segments={businessHours}
          setSegments={setBusinessHours}
          weekdayRange={weekdayRange}
          setWeekdayRange={setWeekdayRange}
          weekendRange={weekendRange}
          setWeekendRange={setWeekendRange}
          onChanged={() => setWarning('')}
          description={
            <>
              요일별 영업 시작·마감 시각을 설정하세요.
              <br />
              <small className='text-muted'>
                시작 시각에 메뉴가 일괄 판매 시작되고, 마감 시각에 일괄 품절 처리됩니다.
              </small>
            </>
          }
        />

        <small className='text-muted d-block mt-3'>
          메뉴 하나만 시간을 따로 정하려면 메뉴 탭의 <b>판매시간</b>을 쓰세요.
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
