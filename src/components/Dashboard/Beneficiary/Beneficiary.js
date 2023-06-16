import { useEffect, useContext } from 'react'
import { areSameAddress } from '../../../modules/ethereum/utils'
import { Grid } from 'semantic-ui-react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Icon from '../../../images/grant_icon.svg'
import { Header } from 'decentraland-ui'
import useResponsive, { onlyMobileMaxWidth } from '../../../hooks/useResponsive'
import { DaoInitiativeContext } from '../../../context/DaoInitiativeContext'
import DaoInitiativeButton from '../../DaoInitiativeButton/DaoInitiativeButton'

import './Beneficiary.css'

function Beneficiary(props) {
  const { address } = props

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })

  const { proposalUrl, setProposalUrl } = useContext(DaoInitiativeContext)

  useEffect(() => {
    const getProposal = async () => {
      const proposals = await (await fetch(process.env.REACT_APP_GRANT_PROPOSALS_API_URL)).json()

      if (proposals) {
        let proposal = proposals.filter((p) => areSameAddress(p['vesting_address'], address))
        if (proposal.length === 1) {
          proposal = proposal[0]
          const proposalUrl = new URL(process.env.REACT_APP_PROPOSALS_URL)
          proposalUrl.searchParams.append('id', proposal.id)
          setProposalUrl(proposalUrl)
        } else {
          console.error(t('error.dao_proposal_url'))
        }
      }
    }

    getProposal()
    // eslint-disable-next-line
  }, [address, isMobile])

  return (
    proposalUrl && (
      <div id="beneficiary">
        <Grid verticalAlign="middle">
          <Grid.Column className="beneficiaryContainer">
            <Grid.Column style={{ width: 'fit-content' }}>
              <img src={Icon} alt="" style={{ marginTop: '5px' }} />
            </Grid.Column>
            <Grid.Column className="beneficiaryText" width={isMobile ? 12 : 9}>
              <Header>{t('beneficiary.title')}</Header>
              <Header sub>{t('beneficiary.subtitle')}</Header>
            </Grid.Column>
          </Grid.Column>
          <Grid.Column className="button__column" floated="right" textAlign="right">
            <DaoInitiativeButton />
          </Grid.Column>
        </Grid>
      </div>
    )
  )
}

export default Beneficiary
