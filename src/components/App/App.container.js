import { connect } from 'react-redux'
import { connect as connectToEthereum } from 'modules/ethereum/actions'
import { getAddress, isLoading as isConnecting, getError as getConnectionError } from 'modules/ethereum/selectors'
import {
  isLoading as isFetchingContract,
  getError as getFetchContractError,
  getContract
} from 'modules/contract/selectors'
import App from './App'

export const mapState = state => {
  let loadingMessage = null
  let connectionError = getConnectionError(state)
  let contractError = getFetchContractError(state)
  const contract = getContract(state)

  let isBlank = !getAddress(state)

  if (isConnecting(state)) {
    loadingMessage = 'Connecting...'
  } else if (isFetchingContract(state)) {
    loadingMessage = 'Loading data...'
  }

  if (contract && contract.beneficiary === '0x') {
    isBlank = true
  }

  return {
    loadingMessage,
    connectionError,
    contractError,
    isBlank,
    isLoaded: !!contract
  }
}

export const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectToEthereum())
})

export default connect(mapState, mapDispatch)(App)
