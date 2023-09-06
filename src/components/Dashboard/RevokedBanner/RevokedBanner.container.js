import RevokedBanner from './RevokedBanner'
import { getContract } from '../../../modules/contract/selectors'
import { connect } from 'react-redux'

export const mapState = (state) => {
  return {
    contract: getContract(state),
  }
}

export default connect(mapState)(RevokedBanner)
