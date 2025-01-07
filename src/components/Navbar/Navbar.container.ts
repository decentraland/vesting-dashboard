import { connect } from 'react-redux'
import { getPendingTransactions } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { getAddress, isConnected } from 'decentraland-dapps/dist/modules/wallet/selectors'
import Navbar from './Navbar'

import { RootState } from '../../modules/reducer'
import { getCurrentIdentity } from '../../modules/identity/selector'
import { MapStateProps } from './Navbar.types'
import { getIsNavbar2Enabled } from '../../modules/features/selectors'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)

  return {
    hasActivity: address ? getPendingTransactions(state, address).length > 0 : false,
    isConnected: isConnected(state),
    identity: getCurrentIdentity(state) || undefined,
    isNavbar2Enabled: getIsNavbar2Enabled(state),
  }
}

export default connect(mapState)(Navbar)
