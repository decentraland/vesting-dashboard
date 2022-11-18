import { connect } from 'react-redux'
import { getContract, getVersion } from '../../../modules/contract/selectors'
import { getTicker } from '../../../modules/ticker/selectors'
import Chart from './Chart'

export const mapState = (state) => {
  return {
    contract: getContract(state),
    ticker: getTicker(state),
    version: getVersion(state),
  }
}

export default connect(mapState)(Chart)
