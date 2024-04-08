import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { connect as connectToEthereum } from '../../modules/ethereum/actions'
import { getNetwork, getChainId, getError, isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import {
  isLoading as isFetchingContract,
  getError as getContractError,
  getContract,
  getAddress,
} from '../../modules/contract/selectors'
import App from './App'

export const mapState = (state) => {
  let loadingMessage = null
  let connectionError = getError(state)
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
    network,
    chainId,
  }
}

export const mapDispatch = (dispatch) => ({
  onConnect: () => {
    dispatch(connectToEthereum())
  },
})

export default withRouter(connect(mapState, mapDispatch)(App))
