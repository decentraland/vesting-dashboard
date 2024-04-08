import { connect } from 'react-redux'
import { getTicker } from '../../../modules/ticker/selectors'
import Chart from './Chart'

export const mapState = (state) => {
  return {
    ticker: getTicker(state),
  }
}

export default connect(mapState)(Chart)
