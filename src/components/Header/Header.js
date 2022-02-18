import React, { Component } from "react";
// import PropTypes from "prop-types";
import "./Header.css";
import { Button } from "decentraland-ui";

// class Header extends Component {
//   static propTypes = {
//     address: PropTypes.string.isRequired
//   };
//   render() {
//     const { address } = this.props;
//     return (
//       <div className="header">
//         <div className="header-left">
//           <div className="header-icon" />
//           <h1 className="header-title">Decentraland</h1>
//         </div>
//         <div className="header-right">
//           <h3 className="header-description">Decentraland's MANA Token Vesting</h3>
//           <div className="header-contract-address">{address}</div>
//         </div>
//       </div>
//     );
//   }
// }
class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header-left">
          <div className="header-icon" />
          <h1 className="header-title">Decentraland</h1>
        </div>
        <Button primary>Test</Button>
        {/* <div className="header-right">
          <h3 className="header-description">Decentraland's MANA Token Vesting</h3>
          <div className="header-contract-address">{address}</div>
        </div> */}
      </div>
    );
  }
}

export default Header;
