import axios from "axios";

export const baseUrl = import.meta.env.VITE_API_URL;

// 타임아웃이 없으면(axios 기본값 0) 서버가 응답하지 않을 때 요청이 영원히 끝나지 않는다.
// 그러면 호출부의 finally 가 실행되지 않아 중복요청 방지 플래그가 풀리지 않고,
// 버튼이 새로고침 전까지 죽은 채로 남는다. (OrderTable 의 cannotUpdate 참고)
// 엑셀 생성·업로드처럼 정당하게 오래 걸리는 요청은 호출부에서 timeout 을 따로 넘긴다.
const client = axios.create({
  baseURL: baseUrl,
  responseType: 'json',
  withCredentials: true,
  timeout: 15000,
});

export const printerClient = axios.create({
  baseURL: import.meta.env.VITE_PRINTER_URL,
  responseType: 'json',
  withCredentials: true,
  timeout: 5000, // 프린터는 로컬 서비스라 짧게 끊는다
})

/** 엑셀 생성·업로드처럼 기본 타임아웃(15초)을 정당하게 넘길 수 있는 요청에 쓴다. */
export const LONG_REQUEST_TIMEOUT = 120000;

export default client;
