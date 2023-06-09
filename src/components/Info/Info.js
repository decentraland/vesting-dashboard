import { Popup } from 'decentraland-ui'
import InfoSVG from '../../images/info.svg'

/*
  Position for the popover.
    | 'top left'
    | 'top right'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center'
    | 'top center'
    | 'bottom center'
*/

function Info(props) {
  const { message, position } = props

  return (
    <span className="info" style={{ padding: '5px' }}>
      <Popup
        content={message}
        position={position}
        trigger={<img src={InfoSVG} alt="" />}
        on="hover"
        style={{ height: '100%' }}
        basic
      />
    </span>
  )
}

export default Info
