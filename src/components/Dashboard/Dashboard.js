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

function Dashboard() {
  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })

  return (
    <Container className="dashboard">
      <Overview />
      <Beneficiary />
      <RevokedBanner />
      <Grid stackable columns={2} padded style={{ width: '100%' }}>
        <Grid.Column width={12} style={{ paddingLeft: 0 }}>
          <PendingFunds />
          <Progress />
          <Chart />
          <Summary />
        </Grid.Column>
        <Grid.Column width={4} style={{ paddingRight: 0, paddingLeft: '41px' }}>
          {isMobile ? (
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Schedule />
                </Grid.Column>
                <Grid.Column className="detailsMobile">
                  <Details />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          ) : (
            <>
              <Schedule />
              <Details />
            </>
          )}
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Dashboard
