import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Banner from '../../Banner/Banner'
import Icon from '../../../images/revoke_icon.svg'
import './RevokedBanner.css'

function RevokedBanner({ contract }) {
  const { revoked } = contract
  return (
    <>
      {revoked && (
        <Banner
          className="revoked"
          icon={Icon}
          title={t('revoked_banner.title')}
          subtitle={t('revoked_banner.subtitle')}
        />
      )}
    </>
  )
}

export default RevokedBanner
