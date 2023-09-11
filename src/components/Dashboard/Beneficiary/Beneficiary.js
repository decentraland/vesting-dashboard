import { useEffect, useContext } from 'react'
import { isSameAddress } from '../../../modules/ethereum/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Icon from '../../../images/grant_icon.svg'
import { DaoInitiativeContext } from '../../../context/DaoInitiativeContext'
import DaoInitiativeButton from '../../DaoInitiativeButton/DaoInitiativeButton'
import Banner from '../../Banner/Banner'

import './Beneficiary.css'

function Beneficiary(props) {
  const { address } = props

  const { proposalUrl, setProposalUrl } = useContext(DaoInitiativeContext)

  useEffect(() => {
    const getVestings = async () => {
      const vestings = await (await fetch(process.env.REACT_APP_VESTINGS_API_URL)).json()

      if (vestings) {
        let vesting = vestings.filter((p) => isSameAddress(p['vesting_address'], address))
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
  }, [address])

  return (
    proposalUrl && (
      <Banner
        className="beneficiary"
        icon={Icon}
        title={t('beneficiary.title')}
        subtitle={t('beneficiary.subtitle')}
        action={<DaoInitiativeButton />}
      />
    )
  )
}

export default Beneficiary
