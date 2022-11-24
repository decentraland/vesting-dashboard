import React from 'react'
import { Grid } from 'semantic-ui-react'
import { Header } from 'decentraland-ui'
import Bar from './Bar/Bar'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import Info from '../../Info/Info'
import './Progress.css'

function Progress(props) {
  const { contract } = props
  const vestedPercentage = Math.round(
    (contract.vestedAmount / contract.total) * 100
  )
  const releasedPercentage = Math.round(
    (contract.released / contract.total) * 100
  )

  return (
    <div id="progress">
      <Grid>
        <Grid.Column floated="left">
          <Header sub>
            <FormattedMessage id="progress.vested" />
            <Info
              message={<FormattedMessage id="helper.vesting_so_far" />}
              position="right center"
            />
          </Header>
          <div className="amount">
            <Header style={{ display: 'inline-block' }}>
              <FormattedNumber value={Math.round(contract.vestedAmount)} />{' '}
              {contract.symbol}
            </Header>
            <span className="percentage vested">{vestedPercentage}%</span>
          </div>
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <Header sub>
            <Info
              message={<FormattedMessage id="helper.total_vesting" />}
              position="left center"
            />
            <FormattedMessage id="progress.total" />
          </Header>
          <Header style={{ display: 'inline-block' }}>
            <FormattedNumber value={Math.round(contract.total)} />{' '}
            {contract.symbol}
          </Header>
        </Grid.Column>
      </Grid>
      <Bar vested={vestedPercentage} released={releasedPercentage} />
      <div>
        <FormattedMessage
          id="progress.released"
          values={{
            b: (chunks) => <b>{chunks}</b>,
            amount: <FormattedNumber value={Math.round(contract.released)} />,
            token: contract.symbol,
          }}
        />
        <span className="percentage released">{releasedPercentage}%</span>
      </div>
    </div>
  )
}

export default Progress
