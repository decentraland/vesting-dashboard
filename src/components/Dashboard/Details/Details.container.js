import { connect } from 'react-redux'
import { release } from '../../../modules/contract/actions'
import { getContract } from '../../../modules/contract/selectors'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isSameAddress } from '../../../modules/ethereum/utils'
import Details from './Details'

export const mapState = (state) => {
  const contract = getContract(state)
  const address = getAddress(state)
  return {
    contract,
    isBeneficiary: isSameAddress(contract.beneficiary, address),
  }
}

export const mapDispatch = (dispatch) => ({
  onRelease: () => dispatch(release()),
})

export default connect(mapState, mapDispatch)(Details)
