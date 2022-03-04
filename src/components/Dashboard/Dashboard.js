import "./Dashboard.css";
import React, { Component } from "react";
import Progress from "./Progress";
import Details from "./Details";
import { Container, Grid } from "semantic-ui-react";
import Overview from "./Overview";
import Beneficiary from "./Beneficiary";
import Schedule from "./Schedule";
import Chart from "./Chart";
import Summary from "./Summary";

class Dashboard extends Component {
  render() {
    return (
      <Container className="dashboard">
        <Overview />
        <Beneficiary />
        <Grid columns={2} padded style={{ width: "100%" }}>
          <Grid.Column width={13} style={{ paddingLeft: 0 }}>
            <Progress />
            <Chart />
            <Summary />
          </Grid.Column>
          <Grid.Column width={3} style={{ paddingRight: 0 }}>
            <Schedule />
            <Details />
          </Grid.Column>
        </Grid>

        {/* <Chart /> */}
        {/* <Summary /> */}
        {/* <Schedule /> */}
      </Container>
      // <div className="dashboard">
      //   <div className="dashboard-left">
      //     <Progress />
      //     <Details />
      //   </div>
      //   <div className="dashboard-right">
      //     <Schedule />
      //   </div>
      // </div>
    );
  }
}

export default Dashboard;
