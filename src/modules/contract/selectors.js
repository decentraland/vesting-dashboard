import { createSelector } from 'reselect'

export const getState = (state) => state.app.contract
export const getContract = (state) => getState(state).data
export const isLoading = (state) => getState(state).loading
export const getError = (state) => getState(state).error

export const getPathnameSplit = (state) =>
  state.routing.location?.pathname.split('/') || null

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

export const getTotal = (state) => {
  const contract = getContract(state)

  if (!contract) {
    return null
  }

  const version = getVersion(state)

  if (!version) {
    return null
  }

  const { balance, released, vestedPerPeriod } = contract

  return version === 'v1'
    ? balance + released
    : vestedPerPeriod.reduce((a, b) => a + b, 0)
}

export const getPendingFunds = (state) => {
  const contract = getContract(state)

  if (!contract) {
    return null
  }

  const total = getTotal(state)

  if (total === null) {
    return null
  }

  let pendingTotal = 0
  let pendingReleasable = 0

  const { balance, released, releasableAmount } = contract

  if (balance + released < total) {
    pendingTotal = total - (balance + released)
  }

  if (balance < releasableAmount) {
    pendingReleasable = releasableAmount - balance
  }

  return {
    pendingTotal,
    pendingReleasable,
  }
}
