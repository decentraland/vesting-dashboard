import React, { Component } from "react";
import "./Bar.css";

class Bar extends Component {
  render() {
    const { percentage, color } = this.props;
    return <div className="progress-bar" style={{ backgroundColor: color, width: percentage + "%" }} />;
  }
}

export default Bar;
