import User from "@src/models/manager/User.ts";
export const LAST_SEQ = 10000;
export const FRUIT_ID = 1;

export function makePair<T>(data: T[]) {
  return data.reduce((prev, cur, index) => {
    if(index % 2 === 0) {
      prev.push([cur]);
    } else {
      prev[(index - 1) / 2].push(cur);
    }

    return prev;
  }, [] as T[][]);
}

export function formatFloor(floor: string | undefined) {
  if (floor?.charAt(0).toLowerCase() === 'b') {
    return `지하 ${floor.substring(1)}${floor?.slice(-1).toLowerCase() === 'f' ? 'F' : '층'}`;
  } else {
    return `${floor}층`
  }
}

export function formatCurrency(num: number | string | undefined, noZero?: boolean) {
  if (noZero && num === 0) {
    return '';
  }

  const n = typeof num === "string" ? parseInt(num) : num;

  if (n === undefined) {
    return '';
  }

  return `${n < 0 ? "-" : ""}₩${n.toLocaleString('ko-KR').replace('-', '')}`;
}

export function getUrl(user: User) {
  switch(user.permission) {
    case 1: return 'manager';
    case 2: return 'rider';
    case 3: return 'cook';
    case 9: return '';
  }
}