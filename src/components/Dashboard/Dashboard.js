import './Dashboard.css'
import React from 'react'
import Progress from './Progress'
import Details from './Details'
import { Container, Grid } from 'semantic-ui-react'
import Overview from './Overview'
import Beneficiary from './Beneficiary'
import Schedule from './Schedule'
import Chart from './Chart'
import Summary from './Summary'
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive'
import useResponsive from '../../hooks/useResponsive'

function Dashboard() {
  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth })

  return (
    <Container className="dashboard">
      <Overview />
      <Beneficiary />
      <Grid stackable columns={2} padded style={{ width: '100%' }}>
        <Grid.Column width={12} style={{ paddingLeft: 0 }}>
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
