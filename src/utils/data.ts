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