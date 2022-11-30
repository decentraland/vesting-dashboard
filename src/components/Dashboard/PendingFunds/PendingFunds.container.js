import { connect } from 'react-redux'
import { getContract } from '../../../modules/contract/selectors'
import PendingFunds from './PendingFunds'

export const mapState = (state) => {
  return {
    contract: getContract(state),
  }
}

export default connect(mapState, null)(PendingFunds)
