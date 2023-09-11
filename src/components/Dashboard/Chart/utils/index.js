export const DAY_IN_SECONDS = 86400

export function getDurationInDays(duration) {
  return Math.ceil(duration / DAY_IN_SECONDS) + 1
}

export function getCliffEndDay(start, cliff) {
  return Math.floor((cliff - start) / DAY_IN_SECONDS)
}

export function getDaysFromStart(start) {
  return Math.ceil((new Date() - new Date(start * 1000)) / (DAY_IN_SECONDS * 1000))
}

export function getDaysFromRevoke(revokeTs, start) {
  return Math.floor((revokeTs - start) / DAY_IN_SECONDS) + 1
}

export function toDataArray(length, callback) {
  return Array.from(new Array(length >= 0 ? length : 0), callback)
}

export function emptyDataArray(length) {
  return toDataArray(length, () => '-')
}
