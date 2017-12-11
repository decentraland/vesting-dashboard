import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-top">
          <div className="footer-foundation">Decentraland Foundation</div>
          <div className="footer-links">
            <a href="#">Blog</a>
            <a href="#">FAQs</a>
            <a href="#">Contribution Period</a>
            <a href="#">Get in touch</a>
          </div>
          <div className="footer-icons">
            <i class="fab fa-twitter" />
            <i class="fab fa-github" />
            <i class="fab fa-rocketchat" />
            <i class="fab fa-reddit" />
            <i class="fab fa-facebook" />
            <i class="far fa-comment" />
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copyright">Copyright 2017 Decentraland. All rights reserved.</span>
        </div>
      </div>
    );
  }
}

export default Footer;
