import { Component } from 'react'
import './Footer.css'

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
          <span className="footer-copyright">© {new Date().getFullYear()} Decentraland</span>
        </div>
      </div>
    )
  }
}

export default Footer
