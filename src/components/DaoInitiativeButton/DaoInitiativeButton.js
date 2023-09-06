import { useContext } from 'react'
import { DaoInitiativeContext } from '../../context/DaoInitiativeContext'
import useResponsive, { onlyMobileMaxWidth } from '../../hooks/useResponsive'
import { Button } from 'decentraland-ui'
import ButtonIcon from '../../images/proposal_button_icon.svg'
import { openInNewTab } from '../../utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import './DaoInitiativeButton.css'

function DaoInitiativeButton() {
  const { proposalUrl } = useContext(DaoInitiativeContext)
  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })
  return (
    <Button primary onClick={(e) => openInNewTab(proposalUrl, e)} href={proposalUrl} className="daoProposal__button">
      {t(isMobile ? 'beneficiary.button.mobile' : 'beneficiary.button')}
      <img src={ButtonIcon} alt="" />
    </Button>
  )
}

export default DaoInitiativeButton
