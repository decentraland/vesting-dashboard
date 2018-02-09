import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from './Row'
import { toDate, toMANA, toUSD } from 'utils'
import { ContractType } from 'components/types'
import Blockie from './Blockie'
import Card from 'components/Card'
import './Details.css'

class Details extends Component {
  static propTypes = {
    contract: ContractType.isRequired,
    isBeneficiary: PropTypes.bool
  }
  handleRelease = () => {
    const { contract, onRelease } = this.props
    const { releasableAmount } = contract
    if (releasableAmount > 0) {
      onRelease()
    } else {
      alert("You don't have any MANA to release")
    }
  }
  render() {
    const { contract, ticker, isBeneficiary, onChangeBeneficiary } = this.props
    const { beneficiary, start, cliff, duration, releasableAmount, revocable, revoked } = contract
    let releaseButton = null
    let changeBeneficiaryButton = null
    if (isBeneficiary) {
      releaseButton = (
        <span className="action-btn" onClick={this.handleRelease}>
          Release
        </span>
      )
      changeBeneficiaryButton = (
        <span className="action-btn" onClick={onChangeBeneficiary}>
          Change
        </span>
      )
    }
    return (
      <Card title="Details">
        <Row label="Beneficiary" title={beneficiary}>
          <Blockie seed={beneficiary} />
          &nbsp;&nbsp;{beneficiary.slice(0, 6)}...{beneficiary.slice(-4)}
          {changeBeneficiaryButton}
        </Row>
        <Row label="Start date">{toDate(start)}</Row>
        <Row label="Cliff">{toDate(cliff)}</Row>
        <Row label="End date">{toDate(start + duration)}</Row>
        <Row label="Relesable">
          {toMANA(releasableAmount)} MANA / {toUSD(releasableAmount, ticker)} USD{releaseButton}
        </Row>
        <Row label={revoked ? 'Revoked' : 'Revocable'}>{revoked ? 'Yes' : revocable ? 'Yes' : 'No'}</Row>
      </Card>
    )
  }
}

export default Details
