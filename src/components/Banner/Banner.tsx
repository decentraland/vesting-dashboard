import { Header } from 'decentraland-ui'
import './Banner.css'

function Banner(props) {
  const { icon, title, subtitle, action, className } = props

  return (
    <div className={`banner ${className ? className : ''}`}>
      <div className="bannerContainer">
        <div style={{ width: 'fit-content' }}>{icon && <img src={icon} alt="" style={{ marginTop: '5px' }} />}</div>
        <div className="bannerText" width={9}>
          <Header>{title}</Header>
          <Header sub>{subtitle}</Header>
        </div>
      </div>
      <div className="bannerAction">{action}</div>
    </div>
  )
}

export default Banner
