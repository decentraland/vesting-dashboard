import React, { Component } from "react";
import "./Metric.css";
import * as numeral from "numeral";

class Metric extends Component {
  render() {
    const { percentage, color, amount, label, style, alt } = this.props;
    const percentageClasses = "metric-percentage" + (alt ? " alt" : "");
    return (
      <div className="metric" style={style}>
        <div className="metric-label">{label}</div>
        <div className="metric-amount">{numeral(amount).format("0,0")} MANA</div>
        <div style={{ backgroundColor: color }} className={percentageClasses}>
          {percentage}%
        </div>
      </div>
    );
  }
}

export default Metric;
