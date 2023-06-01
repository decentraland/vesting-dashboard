import React, { useState } from 'react'
import { Header, Popup, Button } from 'decentraland-ui'
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedPlural } from 'react-intl'
import { copyToClipboard, getMonthDiff } from '../../../utils'
import Info from '../../Info/Info'
import AddressIcon from '../../../images/address_icon.svg'
import useResponsive, { onlyMobileMaxWidth } from '../../../hooks/useResponsive'
import ChangeBeneficiaryModal from '../../ChangeBeneficiaryModal'
import { ContractVersion } from '../../../modules/constants'
import './Details.css'

function addressShortener(address) {
  return address.substring(0, 6) + '...' + address.substring(38, 42)
}

function getBeneficiary(addr) {
  return (
    <div className="item beneficiary">
      <Header sub>
        <FormattedMessage id="details.beneficiary" />
      </Header>
      <Header onClick={() => copyToClipboard(addr)} style={{ cursor: 'pointer' }}>
        <img src={AddressIcon} alt="" />
        <Popup
          content={<FormattedMessage id="global.copied" />}
          position="bottom center"
          trigger={<span>{addressShortener(addr)}</span>}
          on="click"
        />
        <Info message={<FormattedMessage id="helper.beneficiary" />} position="left center" />
      </Header>
    </div>
  )
}

function getDate(id, date) {
  return (
    <div className="item">
      <Header sub>
        <FormattedMessage id={id} />
      </Header>
      <Header>
        <FormattedDate value={new Date(date * 1000)} year="numeric" month="long" day="numeric" />
      </Header>
    </div>
  )
}

function getCliffPeriod(vestingCliff) {
  return (
    <div className="item">
      <Header sub>
        <FormattedMessage id="details.cliff_period" />
      </Header>
      <Header>
        <FormattedMessage
          id="details.cliff_period.time"
          values={{
            cliff: vestingCliff,
            monthPl: (
              <FormattedPlural
                value={vestingCliff}
                one={<FormattedMessage id="global.month" />}
                other={<FormattedMessage id="global.month.plural" />}
              />
            ),
          }}
        />
        <Info message={<FormattedMessage id="helper.cliff_period" />} position="left center" />
      </Header>
    </div>
  )
}

function getAmount(id, value, symbol, helperId) {
  return (
    <div className="item">
      <Header sub>
        <FormattedMessage id={id} />
      </Header>
      <Header>
        <FormattedNumber value={value} /> {symbol}
        <Info message={<FormattedMessage id={helperId} />} position="left center" />
      </Header>
    </div>
  )
}

function getRevocable(revocable) {
  return (
    <div className="item">
      <Header sub>
        <FormattedMessage id="details.revocable" />
      </Header>
      <Header>{revocable ? <FormattedMessage id="global.yes" /> : <FormattedMessage id="global.no" />}</Header>
    </div>
  )
}

function getPausable(pausable) {
  return (
    <div className="item">
      <Header sub>
        <FormattedMessage id="details.pausable" />
      </Header>
      <Header>{pausable ? <FormattedMessage id="global.yes" /> : <FormattedMessage id="global.no" />}</Header>
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
  const { contract, isBeneficiary, onRelease } = props
  const { version, symbol, released, start, cliff, duration, releasableAmount, revocable, pausable, total } = contract

  const vestingCliff = getMonthDiff(start, cliff)
  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModalHandler = () => setIsModalOpen(false)

  return (
    <div id="details" className={(isMobile && 'mobile') || ''}>
      <div className="divToStyle">
        {getBeneficiary(contract.beneficiary)}
        {!isMobile &&
          isBeneficiary &&
          getActionButton(<FormattedMessage id="details.change_beneficiary" />, () => setIsModalOpen(true))}
        <div className="dates">
          {getDate('details.start', start)}
          {getDate('details.end', start + duration)}
        </div>
      </div>
      {getCliffPeriod(vestingCliff)}
      {getAmount('details.total_vesting', total, symbol, 'helper.total_vesting')}
      {getAmount('details.released', released, symbol, 'helper.released')}
      {getAmount('details.releasable', releasableAmount, symbol, 'helper.releasable')}
      {!isMobile &&
        isBeneficiary &&
        releasableAmount > 0 &&
        getActionButton(<FormattedMessage id="details.release_funds" />, onRelease)}
      {getRevocable(revocable)}
      {version === ContractVersion.V2 && getPausable(pausable)}
      <ChangeBeneficiaryModal open={isModalOpen} onClose={closeModalHandler} />
    </div>
  )
}

export default React.memo(Details)
