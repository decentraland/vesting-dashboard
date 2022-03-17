import moment from 'moment'
import numeral from 'numeral'

export const toDate = (s) => moment(s * 1000).format('dddd, MMM Do, YYYY')
export const toUSD = (amount, ticker) => (ticker ? '$' + numeral(amount * ticker).format('0,0.00') : '...')
export const toMANA = (amount) => numeral(amount).format('0,0')

export const colors = {
  lightBlue: '#ff2d55',
  darkPurple: '#16141a',
  green: '#c640cd',
  darkGray: '#222222',
  lightGray: '#d3d3d3',
}

export function getToday() {
  return moment().subtract(1, 'month').endOf('month').add(1, 'days').format('MMM Do, YYYY')
}

export function isValidAddress(address) {
  return /^(0x)?[0-9a-f]{40}$/i.test(address)
}

export function getMonthDiff(start, finish) {
  const getDate = (date) => moment(date * 1000).startOf("month");
  return Math.abs(getDate(finish).diff(getDate(start), "months"));
}

export function openInNewTab(event, url) {
  window.open(url, "_blank").focus();
  event.preventDefault();
}

export function copyToClipboard(text) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject("The Clipboard API is not available.");
}