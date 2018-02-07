import React, { Component } from 'react'
import './Metric.css'
import { toMANA, toUSD } from 'utils'

class Metric extends Component {
  render() {
    const { percentage, color, amount, label, style, alt, ticker } = this.props
    const percentageClasses = 'metric-percentage' + (alt ? ' alt' : '')
    return (
      <div className="metric" style={style}>
        <div className="metric-label">{label}</div>
        <div className="metric-amount">{toMANA(amount)} MANA</div>
        <div className="metric-amount">{toUSD(amount, ticker)} USD</div>
        <div style={{ backgroundColor: color }} className={percentageClasses}>
          {percentage}%
        </div>
      </div>
    )
  }
}

export default Metric
