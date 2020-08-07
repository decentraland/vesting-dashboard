import React, { Component } from 'react'
import Metric from './Metric'
import Bar from './Bar'
import { colors } from 'utils'
import { ContractType } from 'components/types'
import './Progress.css'

class Progress extends Component {
  static propTypes = {
    contract: ContractType.isRequired,
  }
  render() {
    const { contract, ticker } = this.props
    const { released, vestedAmount, balance } = contract

    const total = balance + released

    const releasedPercentage = ((released / total) * 100) | 0
    const vestedPercentage = ((vestedAmount / total) * 100) | 0
    const totalPercentage = 100

    return (
      <div className="progress">
        <Metric
          label="Released"
          percentage={releasedPercentage}
          amount={released}
          color={colors.lightBlue}
          ticker={ticker}
        />
        <Metric
          label="Vested"
          percentage={vestedPercentage}
          amount={vestedAmount}
          color={colors.green}
          style={{ bottom: 0, left: vestedPercentage < 20 ? 0 : `calc(${vestedPercentage}% - 90px)` }}
          ticker={ticker}
        />
        <Metric
          label="Total vesting"
          percentage={100}
          amount={total}
          color={colors.lightGray}
          style={{ right: 0 }}
          ticker={ticker}
          alt
        />
        <Bar percentage={totalPercentage} color={colors.lightGray} />
        <Bar percentage={vestedPercentage} color={colors.green} />
        <Bar percentage={releasedPercentage} color={colors.lightBlue} />
      </div>
    )
  }
}

export default Progress
