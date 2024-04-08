import { Logo } from 'decentraland-ui'
import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Container } from 'semantic-ui-react'
import { isValidAddress } from '../../utils'
import Input from '../Input'

// TODO: Remove is not found, check other props
function LandingPage(props) {
  const { stateAddress, isNotFound, address, network, onAddressChange } = props

  let helpText = t('helper.landing_page.continue')
  if (!stateAddress) {
    helpText = t('helper.landing_page.provide_contract')
  } else if (!isValidAddress(stateAddress)) {
    helpText = t('helper.landing_page.address_not_valid')
  } else if (isNotFound && stateAddress === address) {
    helpText =
      t('helper.landing_page.no_contract') +
      (network && network.name !== 'mainnet' && `\n${t('helper.landing_page.network', { network: network.name })}`)
  }

  return (
    <Container className="Landing">
      <Logo />
      <h3>{t('landing_page.title')}</h3>
      <Input value={stateAddress} placeholder="0x..." onChange={onAddressChange} />
      <p className="help">{helpText}</p>
    </Container>
  )
}

export default React.memo(LandingPage)
