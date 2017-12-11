import React, { Component } from "react";
import { Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { colors } from "utils";
import "./Schedule.css";

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

const MONTH = 60 * 60 * 24 * 30;

const total = 5500;

const data = [];

let cliffed = false;

const fraction = MONTH / contract.duration * total;
let current = 0;
for (var i = contract.start; i < contract.start + contract.duration; i += MONTH) {
  current++;
  if (i >= contract.cliff) {
    const amount = (current * fraction) | 0;
    data.push({
      MANA: amount < total ? amount : total,
      label: !cliffed ? "" : ""
    });
    cliffed = true;
  } else {
    data.push({
      MANA: 0,
      label: ""
    });
  }
}
console.log(data);

const wrapperStyle = {
  backgroundColor: "black",
  padding: 2,
  borderColor: colors.darkGray
};

const labelStyle = {
  color: "white"
};

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };

    this.refContainer = this.refContainer.bind(this);
  }
  refContainer(element) {
    if (element) {
      const rect = element.getBoundingClientRect();
      if (this.state.width !== rect.width || this.state.height !== rect.height) {
        this.setState({
          width: rect.width,
          height: rect.height
        });
      }
    }
  }
  render() {
    return (
      <div className="schedule" ref={this.refContainer}>
        <h3>Schedule</h3>
        <LineChart
          width={this.state.width}
          height={this.state.height - 50}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis dataKey="label" stroke={colors.darkGray} />
          <YAxis stroke={colors.darkGray} />
          <Line dataKey="MANA" stroke={colors.green} />
          <Tooltip wrapperStyle={wrapperStyle} labelStyle={labelStyle} />
        </LineChart>
      </div>
    );
  }
}

export default Schedule;
