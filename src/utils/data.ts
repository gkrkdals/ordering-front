import User from "@src/models/manager/User.ts";

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

export function formatCurrency(num: number | undefined) {
  return `${num?.toLocaleString('ko-KR')}₩`;
}

export function getUrl(user: User) {
  switch(user.permission) {
    case 1: return 'manager';
    case 2: return 'rider';
    case 3: return 'cook';
    case 9: return '';
  }
}