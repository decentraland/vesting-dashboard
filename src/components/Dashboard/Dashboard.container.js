import { getContract } from '../../modules/contract/selectors'
import Dashboard from './Dashboard'
import { connect } from 'react-redux'

export const mapState = (state) => {
  return {
    contract: getContract(state),
  }
}

export default connect(mapState)(Dashboard)
