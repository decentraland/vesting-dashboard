import React, { Component } from "react";
import Row from "./Row";
import { toDate, toMANA } from "utils";
import { ContractType } from "components/types";
import Blockie from "./Blockie";
import "./Details.css";

class Details extends Component {
  static propTypes = {
    contract: ContractType.isRequired
  };
  render() {
    const { contract } = this.props;
    const { beneficiary, start, cliff, duration, releasableAmount, revocable } = contract;
    return (
      <div className="details">
        <h3>Details</h3>

        <Row label="Beneficiary">
          <Blockie seed={beneficiary} />
          &nbsp;&nbsp;{beneficiary.slice(0, 4)}...{beneficiary.slice(-4)}
        </Row>
        <Row label="Start date">{toDate(start)}</Row>
        <Row label="Cliff">{toDate(cliff)}</Row>
        <Row label="End date">{toDate(start + duration)}</Row>
        <Row label="Relesable">
          {toMANA(releasableAmount)} <span className="release-btn">Release</span>
        </Row>
        <Row label="Revokable">{revocable ? "Yes" : "No"}</Row>
      </div>
    );
  }
}

export default Details;
