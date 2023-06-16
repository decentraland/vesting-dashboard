import moment from 'moment'

export const DATE_FORMAT_LONG = 'MMMM D, YYYY'
export const DATE_FORMAT_SHORT = 'MMM D, YYYY'

export function isValidAddress(address) {
  return /^(0x)?[0-9a-f]{40}$/i.test(address)
}

export function getMonthDiff(start, finish) {
  const getDate = (date) => moment(date * 1000).startOf('month')
  return Math.abs(getDate(finish).diff(getDate(start), 'months'))
}

export function openInNewTab(url, event = null) {
  window.open(url, '_blank').focus()
  if (event) {
    event.preventDefault()
  }
}

export function copyToClipboard(text) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }
  return Promise.reject('The Clipboard API is not available.')
}
