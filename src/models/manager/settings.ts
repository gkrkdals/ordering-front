export interface Settings {
  id: number;
  big: number;
  sml: number;
  name: string;
  value: number;
  stringValue: string;
}

/**
 * 요일별 그릇 수거 가능 시간 설정 행. (big=6, sml 1=월 … 7=일)
 * 제한이 없는 요일은 stringValue 가 null 로 내려옵니다.
 */
export interface DisposalTimeSetting extends Omit<Settings, 'stringValue'> {
  stringValue: string | null;
}