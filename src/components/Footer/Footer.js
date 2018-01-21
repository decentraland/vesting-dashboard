import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-top">
          <div className="footer-foundation">Decentraland Foundation</div>
          <div className="footer-links">
            <a href="https://blog.decentraland.org/" target="_blank" rel="noopener">
              Blog
            </a>
            <a href="https://decentraland.org/#faqs" target="_blank" rel="noopener">
              FAQs
            </a>
            <a href="mailto:hello@decentraland.org" target="_blank" rel="noopener">
              Get in touch
            </a>
          </div>
          <div className="footer-icons">
            <a href="https://twitter.com/decentraland" target="_blank" rel="noopener">
              <i className="fab fa-twitter" />
            </a>
            <a href="https://github.com/decentraland" target="_blank" rel="noopener">
              <i className="fab fa-github" />
            </a>
            <a href="https://chat.decentraland.org/" target="_blank" rel="noopener">
              <i className="fab fa-rocketchat" />
            </a>
            <a href="https://reddit.com/r/decentraland" target="_blank" rel="noopener">
              <i className="fab fa-reddit" />
            </a>
            <a href="https://www.facebook.com/decentraland/" target="_blank" rel="noopener">
              <i className="fab fa-facebook" />
            </a>
            <a href="https://forum.decentraland.org/" target="_blank" rel="noopener">
              <i className="far fa-comment" />
            </a>
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
