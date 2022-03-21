import { connect } from 'react-redux'
import { getContract } from '../../../modules/contract/selectors'
import Chart from './Chart'
export const mapState = (state) => {
  return {
    contract: getContract(state),
  }
}

export default connect(mapState)(Chart)
