import { createSelector } from 'reselect'
import moment from 'moment'
import { getTicker } from '../ticker/selectors'
import { toUSD } from '../../utils'

export const getState = (state) => state.app.contract
export const getContract = (state) => getState(state).data
export const isLoading = (state) => getState(state).loading
export const getError = (state) => getState(state).error

export const getPathnameSplit = (state) =>
  state.routing.location?.pathname.split('/')

export const getVersion = createSelector(getPathnameSplit, (pathnameSplit) => {
  if (!pathnameSplit) {
    return null
  }

  switch (pathnameSplit.length) {
    case 2:
      return 'v1'
    case 3:
      return 'v2'
    default:
      return null
  }
})

export const getAddress = createSelector(
  getPathnameSplit,
  getVersion,
  (pathnameSplit, version) => {
    if (!pathnameSplit) {
      return null
    }

    switch (version) {
      case 'v1':
        return pathnameSplit[1]
      case 'v2':
        return pathnameSplit[2]
      default:
        return null
    }
  }
)

export const getSchedule = createSelector(
  getContract,
  getTicker,
  (contract, ticker) => {
    const total = contract.balance + contract.released
    const data = []
    const startDate = new Date(contract.start * 1000)
    const currentDate = moment(contract.start * 1000)
      .subtract(1, 'month')
      .endOf('month')
      .add(1, 'days')
    const endDate = new Date(contract.start * 1000 + contract.duration * 1000)
    const cliffDate = new Date(contract.cliff * 1000)
    let finished = false
    while (!finished) {
      const amount =
        (((currentDate.toDate() - startDate) / (endDate - startDate)) * total) |
        0

      data.push({
        MANA: currentDate.toDate() > cliffDate ? amount : 0,
        USD: currentDate.toDate() > cliffDate ? toUSD(amount, ticker) : 0,
        amount: currentDate.toDate() > cliffDate ? amount : 0,
        label: currentDate.format('MMM Do, YYYY'),
      })
      finished = currentDate.toDate() > endDate
      currentDate.endOf('month').add(1, 'days')
    }
    return data
  }
)
