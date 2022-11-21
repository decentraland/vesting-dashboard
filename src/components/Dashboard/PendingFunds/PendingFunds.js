import React from 'react'
import { Segment } from 'decentraland-ui'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import './PendingFunds.css'

function PendingFunds(props) {
  const { pendingFunds, contract } = props

  if (!contract || contract.version !== 'v2' || !pendingFunds) {
    return null
  }

  const { pendingReleasable } = pendingFunds
  const { symbol } = contract

  if (!pendingReleasable) {
    return null
  }

  return (
    <Segment>
      <p>
        <FormattedMessage
          id="pending_funds.releasable"
          values={{
            pending: (
              <b>
                <FormattedNumber value={pendingReleasable} />
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
