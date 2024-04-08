import { connect } from 'react-redux'
import { getPendingTransactions } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { getAddress, isConnected } from 'decentraland-dapps/dist/modules/wallet/selectors'
import Header from './Header'

import { RootState } from '../../modules/reducer'
import { getCurrentIdentity } from '../../modules/identity/selector'
import { MapStateProps } from './Header.types'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)

  return {
    hasActivity: address ? getPendingTransactions(state, address).length > 0 : false,
    isConnected: isConnected(state),
    identity: getCurrentIdentity(state) || undefined,
  }
}

export default connect(mapState)(Header)
