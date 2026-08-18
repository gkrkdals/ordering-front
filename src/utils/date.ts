export function formatDate(rawDate: string | undefined) {
  // const date = new Date(rawDate ?? '').getTime();
  // const now = Date.now();
  // const dateDifference = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  const dateObj = new Date(rawDate ?? '');
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();

  return `${year}-${('00' + month).slice(-2)}-${('00' + day).slice(-2)} ${('00' + hour).slice(-2)}:${('00' + minute).slice(-2)}`;
}

export function dateToString(origin: Date) {
  const year = origin.getFullYear();
  const month = origin.getMonth() + 1;
  const day = origin.getDate();
  const hour = origin.getHours();
  const minute = origin.getMinutes();
  const second = origin.getSeconds();

  return `${year}-${('00' + month).slice(-2)}-${('00' + day).slice(-2)} ${('00' + hour).slice(-2)}:${('00' + minute).slice(-2)}:${('00' + second).slice(-2)}`;
}

/** 요일 라벨. 서버 Settings 의 sml 1~7 과 1:1 대응합니다. (sml 1 = 월요일) */
export const WEEKDAY_NAMES = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

/** 날짜를 서버 Settings 의 sml 요일 인덱스(1=월 … 7=일)로 변환합니다. */
export function getWeekdaySml(date: Date = new Date()): number {
  const day = date.getDay(); // 0=일, 1=월 … 6=토
  return day === 0 ? 7 : day;
}

/** 전날 요일의 sml 인덱스를 반환합니다. (월요일 → 일요일) */
export function getPreviousWeekdaySml(sml: number): number {
  return sml === 1 ? 7 : sml - 1;
}

interface TimeWindow {
  start: number;
  end: number;
}

/** "HH:MM~HH:MM" 을 분 단위 구간으로 파싱합니다. 값이 없거나 형식이 깨지면 null. */
function parseTimeWindow(stringValue: string | null | undefined): TimeWindow | null {
  if (!stringValue) {
    return null;
  }

  const [startTime, endTime] = stringValue.split('~');
  if (!startTime || !endTime) {
    return null;
  }

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  if ([startHour, startMinute, endHour, endMinute].some(n => Number.isNaN(n))) {
    return null;
  }

  return {start: startHour * 60 + startMinute, end: endHour * 60 + endMinute};
}

/**
 * 요일별 그릇 수거 가능 시간 설정을 기준으로 현재 시각이 수거 가능한지 판정합니다.
 * 서버 `back/src/utils/date.ts` 의 동명 함수와 동일한 규칙입니다.
 *
 * - 오늘 요일의 설정값이 없으면 그 요일은 종일 허용입니다.
 * - 시작 시간 > 종료 시간이면 자정을 넘기는 구간이며, 시작 요일이 구간 전체를 소유합니다.
 *   (금요일에 23:00~02:00 설정 → 금 23시부터 토 새벽 2시까지 허용)
 *
 * @param todayValue 오늘 요일 설정 ("HH:MM~HH:MM" 또는 null)
 * @param yesterdayValue 어제 요일 설정 — 자정을 넘겨 오늘 새벽까지 이어지는 구간 판정용
 */
export function isWithinDisposalTime(
  todayValue: string | null | undefined,
  yesterdayValue?: string | null,
  now: Date = new Date()
): boolean {
  const today = parseTimeWindow(todayValue);

  // 미설정 요일 = 종일 허용
  if (!today) {
    return true;
  }

  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  if (today.start <= today.end) {
    // 같은 날 범위 (예: 09:00~18:00)
    if (currentTimeInMinutes >= today.start && currentTimeInMinutes <= today.end) {
      return true;
    }
  } else if (currentTimeInMinutes >= today.start) {
    // 오늘 시작된 자정 넘김 구간의 앞부분 (예: 23:00~02:00 의 23시 이후)
    return true;
  }

  // 어제 시작된 자정 넘김 구간의 뒷부분 (예: 어제 23:00~02:00 의 오늘 새벽)
  const yesterday = parseTimeWindow(yesterdayValue);
  return !!yesterday && yesterday.start > yesterday.end && currentTimeInMinutes <= yesterday.end;
}