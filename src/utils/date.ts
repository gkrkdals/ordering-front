export function formatDate(rawDate: string | undefined) {
  const date = new Date(rawDate ?? '').getTime();
  const now = Date.now();
  const dateDifference = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if(dateDifference < 1) {
    const dateObj = new Date(rawDate ?? '');
    return `${('00' + dateObj.getHours()).slice(-2)}:${('00' + dateObj.getMinutes()).slice(-2)}`;
  } else if (dateDifference === 1) {
    return '전일';
  } else if (dateDifference === 2) {
    return '전전일'
  } else {
    return `${dateDifference}일 전`;
  }
}