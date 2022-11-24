export const getState = (state) => state.app.contract
export const getContract = (state) => getState(state).data
export const isLoading = (state) => getState(state).loading
export const getError = (state) => getState(state).error

export const getAddress = (state) =>
  state.routing.location ? state.routing.location.pathname.slice(1) : null

export const getPendingFunds = (state) => {
  const contract = getContract(state)

  if (!contract) {
    return null
  }

  let pendingTotal = 0
  let pendingReleasable = 0

  const { balance, released, releasableAmount, total } = contract

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
