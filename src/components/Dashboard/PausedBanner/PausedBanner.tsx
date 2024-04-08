import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Banner from '../../Banner/Banner'
import Icon from '../../../images/pause_icon.svg'
import './PausedBanner.css'

function PausedBanner() {
  return (
    <Banner className="paused" icon={Icon} title={t('paused_banner.title')} subtitle={t('paused_banner.subtitle')} />
  )
}

export default PausedBanner
