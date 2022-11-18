import { connect } from 'react-redux'
import {
  getAddress,
  getContract,
  getVersion,
} from '../../../modules/contract/selectors'
import Overview from './Overview'
export const mapState = (state) => {
  return {
    address: getAddress(state),
    contract: getContract(state),
    version: getVersion(state),
  }
}

export default connect(mapState)(Overview)
