import { connect } from 'react-redux'
import { getContract } from '../../../modules/contract/selectors'
import { getTicker } from '../../../modules/ticker/selectors'
import Chart from './Chart'

export const mapState = (state) => {
  return {
    contract: getContract(state),
    ticker: getTicker(state),
  }
}

export default connect(mapState)(Chart)
