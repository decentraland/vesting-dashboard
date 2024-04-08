import { connect } from 'react-redux'
import { getNetwork, getChainId, isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import App from './App'

export const mapState = (state) => {
  const network = getNetwork(state)
  const chainId = getChainId(state)

  return {
    network,
    chainId,
    isConnecting: isConnecting(state),
  }
}

export default connect(mapState)(App)
