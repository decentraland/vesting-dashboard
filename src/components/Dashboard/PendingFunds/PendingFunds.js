import { Segment } from 'decentraland-ui'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { ContractVersion } from '../../../modules/constants'

function PendingFunds(props) {
  const { contract } = props

  if (!contract || contract.version !== ContractVersion.V2) {
    return null
  }

  const { symbol, balance, released, total: contractTotal, vestedAmount, revoked } = contract

  const total = revoked ? vestedAmount : contractTotal
  const diff = total - (balance + released)

  if (!diff) {
    return null
  }

  const formattedMessageId = diff > 0 ? 'pending_funds.requires_more_funding' : 'pending_funds.over_funded'

  return (
    <Segment>
      <p>
        <FormattedMessage
          id={formattedMessageId}
          values={{
            pending: (
              <b>
                <FormattedNumber value={Math.abs(diff)} />
              </b>
            ),
            token: <b>{symbol}</b>,
          }}
        />
      </p>
    </Segment>
  )
}

export default PendingFunds
