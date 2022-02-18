import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-top">
          <div className="footer-foundation"></div>
          <div className="footer-links"></div>
          <div className="footer-icons"></div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copyright">
            Copyright {new Date().getFullYear()} Decentraland. All rights reserved.
          </span>
        </div>
      </div>
    );
  }
}

export default Footer;
