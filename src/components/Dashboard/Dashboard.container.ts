import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'

import { RootState } from '../../modules/reducer'
import Dashboard from './Dashboard'

const mapState = (state: RootState): { address: string } => {
  const address = getAddress(state)

  return {
    address,
  }
}

export default connect(mapState)(Dashboard)
