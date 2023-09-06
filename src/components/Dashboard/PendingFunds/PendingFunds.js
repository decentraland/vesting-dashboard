import { Segment } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatNumber } from 'decentraland-dapps/dist/lib/utils'
import { ContractVersion } from '../../../modules/constants'

function PendingFunds(props) {
  const { contract } = props

  if (!contract || contract.version !== ContractVersion.V2) {
    return null
  }

  const { symbol, balance, released, total: contractTotal, vestedAmount, revoked } = contract

  const total = revoked ? vestedAmount : contractTotal
  const diff = total - (balance + released)

  if (-1 < diff && diff < 1) {
    return null
  }

  const formattedMessageId = diff > 0 ? 'pending_funds.requires_more_funding' : 'pending_funds.over_funded'

  return (
    <Segment>
      <p>
        {t(formattedMessageId, {
          pending: <b>{formatNumber(Math.abs(diff), 0)}</b>,
          token: <b>{symbol}</b>,
        })}
      </p>
    </Segment>
  )
}

export default PendingFunds
