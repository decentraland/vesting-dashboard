import { connect } from 'react-redux'
import { getAddress } from '../../../modules/contract/selectors'
import Beneficiary from './Beneficiary'

export const mapState = (state) => {
  return {
    address: getAddress(state),
  }
}

export default connect(mapState)(Beneficiary)
