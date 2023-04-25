import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { connect as connectToEthereum } from '../../modules/ethereum/actions'
import {
  isLoading as isConnecting,
  getError as getConnectionError,
  getNetwork, getChainId
} from '../../modules/ethereum/selectors'
import {
  isLoading as isFetchingContract,
  getError as getContractError,
  getAddress,
  getContract,
} from '../../modules/contract/selectors'
import App from './App'

export const mapState = state => {
  let loadingMessage = null
  let connectionError = getConnectionError(state)
  let contractError = getContractError(state)
  const contract = getContract(state)
  const network = getNetwork(state)
  const address = getAddress(state)
  const chainId = getChainId(state)
  const isNotFound = contract && contract.beneficiary === '0x'
  const showPrompt = isNotFound || !address

  if (isConnecting(state)) {
    loadingMessage = 'Connecting...'
  } else if (isFetchingContract(state)) {
    loadingMessage = 'Loading data...'
  }

  return {
    address,
    loadingMessage,
    connectionError,
    contractError,
    showPrompt,
    isNotFound,
    isLoaded: !!contract,
    network,
    chainId
  }
}

export const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectToEthereum()),
  onAccess: address => dispatch(push(address))
})

export default withRouter(connect(mapState, mapDispatch)(App))
