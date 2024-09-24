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