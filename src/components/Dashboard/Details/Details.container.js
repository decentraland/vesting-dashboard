import { connect } from 'react-redux'
import { release } from 'modules/contract/actions'
import { getContract } from 'modules/contract/selectors'
import { getAddress } from 'modules/ethereum/selectors'
import { getTicker } from 'modules/ticker/selectors'
import { openChangeBeneficiaryModal } from 'modules/ui/actions'
import { areSameAddress } from 'modules/ethereum/utils'
import Details from './Details'

export const mapState = (state) => {
  const contract = getContract(state)
  const address = getAddress(state)
  const ticker = getTicker(state)
  return {
    contract,
    ticker,
    isBeneficiary: areSameAddress(contract.beneficiary, address),
  }
}

export const mapDispatch = (dispatch) => ({
  onRelease: () => dispatch(release()),
  onChangeBeneficiary: () => dispatch(openChangeBeneficiaryModal()),
})

export default connect(mapState, mapDispatch)(Details)
