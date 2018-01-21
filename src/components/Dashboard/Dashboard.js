import React, { Component } from "react";
import Progress from "./Progress";
import Details from "./Details";
import Schedule from "./Schedule";
import "./Dashboard.css";

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
