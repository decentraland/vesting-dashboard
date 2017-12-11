import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header-left">
          <div className="header-icon" />
          <h1 className="header-title">Decentraland</h1>
        </div>
        <div className="header-right">
          <h3 className="header-description">Decentraland's MANA Token Vesting</h3>
          <div className="header-contract-address">0x0F5D2fB29fb7d3CFeE444a200298f468908cC942</div>
        </div>
      </div>
    );
  }
}

export default Header;
