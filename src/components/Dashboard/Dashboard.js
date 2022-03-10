import "./Dashboard.css";
import React from "react";
import Progress from "./Progress";
import Details from "./Details";
import { Container, Grid } from "semantic-ui-react";
import Overview from "./Overview";
import Beneficiary from "./Beneficiary";
import Schedule from "./Schedule";
import Chart from "./Chart";
import Summary from "./Summary";
import Responsive from "semantic-ui-react/dist/commonjs/addons/Responsive";
import useResponsive from "../../hooks/useResponsive";

function Dashboard() {
  const responsive = useResponsive();
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth });

  return (
    <Container className="dashboard">
      <Overview />
      <Beneficiary />
      <Grid stackable columns={2} padded style={{ width: "100%" }}>
        <Grid.Column width={13} style={{ paddingLeft: 0 }}>
          <Progress />
          <Chart />
          <Summary />
        </Grid.Column>
        <Grid.Column width={3} style={{ paddingRight: 0 }}>
          {isMobile ? (
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Details />
                </Grid.Column>
                <Grid.Column>
                  <Schedule />
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
  );
}

export default Dashboard;
