import { connect } from 'react-redux'
import { getAddress } from '../../modules/ethereum/selectors'
import WalletSelector from './WalletSelector'

export const mapState = (state) => {
  return {
    address: getAddress(state),
  }
}

export default connect(mapState)(WalletSelector)
