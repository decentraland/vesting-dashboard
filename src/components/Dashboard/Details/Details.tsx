import React, { useState } from 'react'
import { Button, Header, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatDate, formatNumber } from 'decentraland-dapps/dist/lib/utils'
import { copyToClipboard, DATE_FORMAT_LONG, getPreciseDiff } from '../../../utils'
import Info from '../../Info/Info'
import AddressIcon from '../../../images/address_icon.svg'
import useResponsive, { onlyMobileMaxWidth } from '../../../hooks/useResponsive'
import ChangeBeneficiaryModal from '../../ChangeBeneficiaryModal'
import { ContractVersion } from '../../../modules/constants'
import './Details.css'
import { isSameAddress } from '../../../modules/ethereum/utils'

function addressShortener(address) {
  return address.substring(0, 6) + '...' + address.substring(38, 42)
}

function getBeneficiary(addr) {
  return (
    <div className="item beneficiary">
      <Header sub>{t('details.beneficiary')}</Header>
      <Header onClick={() => copyToClipboard(addr)} style={{ cursor: 'pointer' }}>
        <img src={AddressIcon} alt="" />
        <Popup
          content={t('global.copied')}
          position="bottom center"
          trigger={<span>{addressShortener(addr)}</span>}
          on="click"
        />
        <Info message={t('helper.beneficiary')} position="left center" />
      </Header>
    </div>
  )
}

function getDate(id, date) {
  // TODO: Check if date is correct

  return (
    <div className="item">
      <Header sub>{t(id)}</Header>
      <Header>{formatDate(new Date(date * 1000).toString(), DATE_FORMAT_LONG)}</Header>
    </div>
  )
}

function getCliffPeriod(vestingCliff) {
  return (
    <div className="item">
      <Header sub>{t('details.cliff_period')}</Header>
      <Header>
        {t('cliff.duration', { months: vestingCliff.months, days: vestingCliff.days })}
        <Info message={t('helper.cliff_period')} position="left center" />
      </Header>
    </div>
  )
}

function getAmount(id, value, symbol, helperId) {
  return (
    <div className="item">
      <Header sub>{t(id)}</Header>
      <Header>
        {formatNumber(value, 0)} {symbol}
        <Info message={t(helperId)} position="left center" />
      </Header>
    </div>
  )
}

function getRevocable(revocable) {
  return (
    <div className="item">
      <Header sub>{t('details.revocable')}</Header>
      <Header>{revocable ? t('global.yes') : t('global.no')}</Header>
    </div>
  )
}

function getPausable(pausable) {
  return (
    <div className="item">
      <Header sub>{t('details.pausable')}</Header>
      <Header>{pausable ? t('global.yes') : t('global.no')}</Header>
    </div>
  )
}

function getActionButton(text, onClick) {
  return (
    <Button basic className="action" onClick={onClick}>
      {text}
    </Button>
  )
}

function Details(props) {
  const { contract, address } = props

  const onRelease = () => null // TODO: Use release from api module
  const isBeneficiary = isSameAddress(address, contract.beneficiary)
  const { version, symbol, released, start, cliff, duration, releasableAmount, revocable, pausable, total } = contract

  const vestingCliff = getPreciseDiff(start, cliff)
  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModalHandler = () => setIsModalOpen(false)

  return (
    <div id="details" className={(isMobile && 'mobile') || ''}>
      <div className="divToStyle">
        {getBeneficiary(contract.beneficiary)}
        {!isMobile && isBeneficiary && getActionButton(t('details.change_beneficiary'), () => setIsModalOpen(true))}
        <div className="dates">
          {getDate('details.start', start)}
          {getDate('details.end', start + duration)}
        </div>
      </div>
      {getCliffPeriod(vestingCliff)}
      {getAmount('details.total_vesting', total, symbol, 'helper.total_vesting')}
      {getAmount('details.released', released, symbol, 'helper.released')}
      {getAmount('details.releasable', releasableAmount, symbol, 'helper.releasable')}
      {!isMobile && isBeneficiary && releasableAmount > 0 && getActionButton(t('details.release_funds'), onRelease)}
      {getRevocable(revocable)}
      {version === ContractVersion.V2 && getPausable(pausable)}
      <ChangeBeneficiaryModal open={isModalOpen} onClose={closeModalHandler} />
    </div>
  )
}

export default React.memo(Details)
