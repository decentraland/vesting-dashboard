import moment from 'moment'
import numeral from 'numeral'

export const toDate = s => moment(s * 1000).format('dddd, MMM Do, YYYY')
export const toUSD = (amount, ticker) => (ticker ? '$' + numeral(amount * ticker.price_usd).format('0,0.00') : '...')
export const toMANA = amount => numeral(amount).format('0,0')

export const colors = {
  lightBlue: '#4db1dd',
  green: '#7fd135',
  darkGray: '#222222'
}

export function getToday() {
  return moment()
    .subtract(1, 'month')
    .endOf('month')
    .add(1, 'days')
    .format('MMM Do, YYYY')
}
