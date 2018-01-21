import React, { Component } from "react";
import Row from "./Row";
import { toDate, toMANA } from "utils";
import { ContractType } from "components/types";
import * as numeral from "numeral";
import Blockie from "./Blockie";
import "./Details.css";

class Details extends Component {
  static propTypes = {
    contract: ContractType.isRequired
  };
  handleRelease = () => {
    const { contract, onRelease } = this.props;
    const { releasableAmount } = contract;
    if (releasableAmount > 0) {
      onRelease();
    } else {
      alert("You don't have any MANA to release");
    }
  };
  render() {
    const { contract, onRelease } = this.props;
    const { beneficiary, start, cliff, duration, releasableAmount, revocable, revoked } = contract;
    return (
      <div className="details">
        <h3>Details</h3>

        <Row label="Beneficiary" title={beneficiary}>
          <Blockie seed={beneficiary} />
          &nbsp;&nbsp;{beneficiary.slice(0, 6)}...{beneficiary.slice(-4)}
        </Row>
        <Row label="Start date">{toDate(start)}</Row>
        <Row label="Cliff">{toDate(cliff)}</Row>
        <Row label="End date">{toDate(start + duration)}</Row>
        <Row label="Relesable">
          {numeral(releasableAmount).format("0,0")} MANA{" "}
          <span className="release-btn" onClick={this.handleRelease}>
            Release
          </span>
        </Row>
        <Row label="Revokable">{revocable ? "Yes" : "No"}</Row>
        <Row label="Revoked">{revoked ? "Yes" : "No"}</Row>
      </div>
    );
  }
}

export default Details;
