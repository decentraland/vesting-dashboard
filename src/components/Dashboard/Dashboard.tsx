import './Dashboard.css'
import Progress from './Progress'
import Details from './Details'
import { Container, Grid } from 'semantic-ui-react'
import Overview from './Overview'
import Beneficiary from './Beneficiary'
import Schedule from './Schedule'
import Chart from './Chart'
import Summary from './Summary'
import useResponsive, { onlyMobileMaxWidth } from '../../hooks/useResponsive'
import PendingFunds from './PendingFunds'
import RevokedBanner from './RevokedBanner'
import PausedBanner from './PausedBanner'
import useContract from '../../hooks/useContract'
import useTicker from '../../hooks/useTicker'

function Dashboard({ contractAddress }) {
  const { contract } = useContract(contractAddress)
  const { paused, revoked } = contract
  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })
  const { ticker } = useTicker()

  return (
    <Container className="dashboard">
      <Overview address={contract?.address} contract={contract} />
      <Beneficiary address={contract?.address} />
      {revoked && <RevokedBanner />}
      {paused && <PausedBanner />}
      <Grid stackable columns={2} padded style={{ width: '100%' }}>
        <Grid.Column width={12} style={{ paddingLeft: 0 }}>
          <PendingFunds contract={contract} />
          <Progress contract={contract} />
          <Chart contract={contract} ticker={ticker} />
          <Summary address={contract.address} contract={contract} ticker={ticker} />
        </Grid.Column>
        <Grid.Column width={4} style={{ paddingRight: 0, paddingLeft: '41px' }}>
          {isMobile ? (
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Schedule contract={contract} />
                </Grid.Column>
                <Grid.Column className="detailsMobile">
                  <Details address={'0xuseraddress'} contract={contract} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          ) : (
            <>
              <Schedule contract={contract} />
              <Details address={'0xuseraddress'} contract={contract} />
            </>
          )}
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Dashboard
