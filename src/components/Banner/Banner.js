import { Grid } from 'semantic-ui-react'
import { Header } from 'decentraland-ui'
import useResponsive, { onlyMobileMaxWidth } from '../../hooks/useResponsive'
import './Banner.css'

function Banner(props) {
  const { icon, title, subtitle, action, className } = props
  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })
  return (
    <div className={`banner ${className ? className : ''}`}>
      <Grid verticalAlign="middle">
        <Grid.Column className="bannerContainer">
          <Grid.Column style={{ width: 'fit-content' }}>
            {icon && <img src={icon} alt="" style={{ marginTop: '5px' }} />}
          </Grid.Column>
          <Grid.Column className="bannerText" width={isMobile ? 12 : 9}>
            <Header>{title}</Header>
            <Header sub>{subtitle}</Header>
          </Grid.Column>
        </Grid.Column>
        <Grid.Column className="bannerAction" floated="right" textAlign="right">
          {action}
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default Banner
