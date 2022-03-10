export const DAY_IN_SECONDS = 86400;

export function getdurationInDays(duration) {
  return Math.floor(duration / DAY_IN_SECONDS) + 1;
}

export function getCliffEndDay(start, cliff) {
  return Math.floor((cliff - start) / DAY_IN_SECONDS);
}

export function getDaysFromStart(start) {
  return Math.ceil((new Date() - new Date(start * 1000)) / (DAY_IN_SECONDS * 1000)) + 1;
}
