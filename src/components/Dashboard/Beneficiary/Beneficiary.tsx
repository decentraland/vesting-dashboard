import { useEffect, useState } from 'react'
import { isSameAddress } from '../../../modules/ethereum/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Icon from '../../../images/grant_icon.svg'
import DaoInitiativeButton from '../../DaoInitiativeButton/DaoInitiativeButton'
import Banner from '../../Banner/Banner'

import './Beneficiary.css'
import { config } from '../../../config/config'

function Beneficiary({ address }) {
  const [proposalUrl, setProposalUrl] = useState<URL>()

  useEffect(() => {
    const getVestings = async () => {
      const vestings = await (await fetch(config.get('VESTINGS_API_URL'))).json()

      if (vestings) {
        let vesting = vestings.filter((p) => isSameAddress(p['vesting_address'], address))
        if (vesting.length === 1) {
          vesting = vesting[0]
          const proposalUrl = new URL(config.get('PROPOSALS_URL'))
          proposalUrl.searchParams.append('id', vesting.proposal_id)
          setProposalUrl(proposalUrl)
        } else {
          console.error(t('error.dao_proposal_url'))
        }
      }
    }

    getVestings()
  }, [address, setProposalUrl])

  return (
    !!proposalUrl && (
      <Banner
        className="beneficiary"
        icon={Icon}
        title={t('beneficiary.title')}
        subtitle={t('beneficiary.subtitle')}
        action={<DaoInitiativeButton proposalUrl={proposalUrl} />}
      />
    )
  )
}

export default Beneficiary
