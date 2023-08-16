import { useEffect, useContext } from 'react'
import { areSameAddresses } from '../../../modules/ethereum/utils'
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
    const getVestings = async () => {
      const vestings = await (await fetch(process.env.REACT_APP_VESTINGS_API_URL)).json()

      if (vestings) {
        let vesting = vestings.filter((p) => areSameAddresses(p['vesting_address'], address))
        if (vesting.length === 1) {
          vesting = vesting[0]
          const proposalUrl = new URL(process.env.REACT_APP_PROPOSALS_URL)
          proposalUrl.searchParams.append('id', vesting.proposal_id)
          setProposalUrl(proposalUrl)
        } else {
          console.error(t('error.dao_proposal_url'))
        }
      }
    }

    getVestings()
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
