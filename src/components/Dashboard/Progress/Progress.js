import React, { Component } from "react";
import Metric from "./Metric";
import Bar from "./Bar";
import "./Progress.css";

const contract = {
  duration: 94747086,
  cliff: 1502961714 + 60 * 60 * 24 * 365,
  beneficiary: "0xd11a019a70986bd607cbc1c1f9ae221c78581f49",
  terraformReserve: "0xcca95e580bbbd04851ebfb85f77fd46c9b91f11c",
  returnVesting: "0x79c1fdaba012b9a094c495a86ce5c6199cf86368",
  vestedAmount: 2543057747586010191384672,
  releasableAmount: 85832527982390930735327,
  revoked: false,
  revocable: false,
  owner: "0x55ed2910cc807e4596024266ebdf7b1753405a11",
  released: 2457225219603619260649345,
  start: 1502961714,
  token: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942"
};

class Progress extends Component {
  render() {
    const { releasableAmount, vestedAmount } = contract;

    const releasedPercentage = 20;
    const vestedPercentage = 75;
    const totalPercentage = 100;

    const releasedColor = "#4db1dd";
    const vestedColor = "#7fd135";
    const totalColor = "#222222";

    return (
      <div className="progress">
        <Metric label="Released" percentage={releasedPercentage} amount={releasableAmount} color={releasedColor} />
        <Metric
          label="Vested"
          percentage={vestedPercentage}
          amount={vestedAmount}
          color={vestedColor}
          style={{ bottom: 0, left: vestedPercentage < 20 ? 0 : `calc(${vestedPercentage}% - 90px)` }}
        />
        <Metric
          label="Total vesting"
          percentage={100}
          amount={releasableAmount}
          color={totalColor}
          style={{ right: 0 }}
        />
        <Bar percentage={totalPercentage} color={totalColor} />
        <Bar percentage={vestedPercentage} color={vestedColor} />
        <Bar percentage={releasedPercentage} color={releasedColor} />
      </div>
    );
  }
}

export default Progress;
