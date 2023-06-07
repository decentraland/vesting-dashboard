import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import Header from './Header'

export const mapState = (state) => {
  const address = getAddress(state)

  return {
    address,
  }
}

export default connect(mapState)(Header)
