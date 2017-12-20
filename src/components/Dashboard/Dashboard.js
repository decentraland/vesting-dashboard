import React, { Component } from "react";
import Progress from "./Progress";
import Details from "./Details";
import Schedule from "./Schedule";
import MANAVesting from "contracts/MANAVesting";
import "./Dashboard.css";
import { eth } from "decentraland-commons";
const main = async () => {
  await eth.connect(null, [MANAVesting]);
  const vesting = eth.getContract("MANAVesting");
  const cliff = await vesting.getCliff();
  console.log("cliff", cliff.toNumber());
};

main();

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-left">
          <Progress />
          <Details />
        </div>
        <div className="dashboard-right">
          <Schedule />
        </div>
      </div>
    );
  }
}

export default Dashboard;
