import React, { Component } from "react";
import Progress from "./Progress";
import Details from "./Details";
import Graph from "./Graph";
import "./Dashboard.css";
import { Container } from "semantic-ui-react";
import Overview from "./Overview";
import Beneficiary from "./Beneficiary";

class Dashboard extends Component {
  render() {
    return (
      <Container className="dashboard">
        <Overview />
        <Beneficiary />
        <Progress />
        <Graph />
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
