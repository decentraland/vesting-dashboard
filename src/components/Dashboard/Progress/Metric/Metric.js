import React, { Component } from "react";
import { toMANA } from "utils";
import "./Metric.css";

class Metric extends Component {
  render() {
    const { percentage, color, amount, label, style } = this.props;
    return (
      <div className="metric" style={style}>
        <div className="metric-label">{label}</div>
        <div className="metric-amount">{toMANA(amount)}</div>
        <div style={{ backgroundColor: color }} className="metric-percentage">
          {percentage}%
        </div>
      </div>
    );
  }
}

export default Metric;
