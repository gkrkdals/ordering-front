import {useCallback, useEffect, useMemo, useState} from "react";
import client from "@src/utils/network/client.ts";
import {getPreviousWeekdaySml, getWeekdaySml, isWithinDisposalTime} from "@src/utils/date.ts";
import {DisposalTimeSetting} from "@src/models/manager/settings.ts";

export interface DisposalTimeSettings {
  start_time: string | null;
  end_time: string | null;
}

/**
 * 관리자가 설정한 요일별 그릇 수거 가능 시간을 조회하고, 현재 요청이 가능한 시간인지 판정합니다.
 * 실제 강제는 백엔드(POST /api/order/dish, PUT /api/manager/order)에서 수행되며,
 * 이 훅은 즉각적인 UX 피드백용입니다.
 */
export function useDisposalTime() {
  const [weeklySettings, setWeeklySettings] = useState<DisposalTimeSetting[]>([]);

  useEffect(() => {
    client
      .get('/api/manager/settings/disposal-time')
      .then(res => setWeeklySettings(res.data as DisposalTimeSetting[]))
      .catch(() => {
        // 설정이 없거나 조회 실패 시 전체 시간 가능으로 처리
        setWeeklySettings([]);
      });
  }, []);

  const findValue = useCallback(
    (sml: number) => weeklySettings.find(setting => setting.sml === sml)?.stringValue ?? null,
    [weeklySettings]
  );

  const isWithin = useCallback(() => {
    const sml = getWeekdaySml();
    return isWithinDisposalTime(findValue(sml), findValue(getPreviousWeekdaySml(sml)));
  }, [findValue]);

  // 경고 다이얼로그에 노출할 "오늘 요일" 기준 수거 가능 시간
  const todaySettings = useMemo<DisposalTimeSettings>(() => {
    const [startTime, endTime] = (findValue(getWeekdaySml()) ?? '').split('~');
    return {
      start_time: startTime || null,
      end_time: endTime || null,
    };
  }, [findValue]);

  return {weeklySettings, todaySettings, isWithinDisposalTime: isWithin};
}