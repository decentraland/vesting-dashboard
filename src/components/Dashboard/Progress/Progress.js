import { Grid } from 'semantic-ui-react'
import { Header } from 'decentraland-ui'
import Bar from './Bar/Bar'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatNumber } from 'decentraland-dapps/dist/lib/utils'
import Info from '../../Info/Info'
import './Progress.css'

function Progress(props) {
  const { contract } = props
  const vestedPercentage = Math.round((contract.vestedAmount / contract.total) * 100)
  const releasedPercentage = Math.round((contract.released / contract.total) * 100)

  return (
    <div id="progress">
      <Grid>
        <Grid.Column floated="left">
          <Header sub>
            {t('progress.vested')}
            <Info message={t('helper.vesting_so_far')} position="right center" />
          </Header>
          <div className="amount">
            <Header style={{ display: 'inline-block' }}>
              {formatNumber(Math.round(contract.vestedAmount), 0)} {contract.symbol}
            </Header>
            <span className="percentage vested">{vestedPercentage}%</span>
          </div>
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <Header sub>
            <Info message={t('helper.total_vesting')} position="left center" />
            {t('progress.total')}
          </Header>
          <Header style={{ display: 'inline-block' }}>
            {formatNumber(Math.round(contract.total), 0)} {contract.symbol}
          </Header>
        </Grid.Column>
      </Grid>
      <Bar vested={vestedPercentage} released={releasedPercentage} />
      <div>
        {t('progress.released', {
          b: (chunks) => <b>{chunks}</b>,
          amount: formatNumber(Math.round(contract.released), 0),
          token: contract.symbol,
        })}
        <span className="percentage released">{releasedPercentage}%</span>
      </div>
    </div>
  )
}

export default Progress
