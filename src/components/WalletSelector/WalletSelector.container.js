import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import WalletSelector from './WalletSelector'
import { enableWalletRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'

export const mapState = (state) => {
  return {
    address: getAddress(state),
    isConnecting: isConnecting(state),
  }
}

const mapDispatch = (dispatch) => ({
  onConnect: (providerType) => dispatch(enableWalletRequest(providerType)),
})

export default connect(mapState, mapDispatch)(WalletSelector)
