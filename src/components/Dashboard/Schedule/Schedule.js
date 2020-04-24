import React, { Component } from 'react'
import { Tooltip, LineChart, Line, XAxis, YAxis, ReferenceLine } from 'recharts'
import * as numeral from 'numeral'
import { colors, getToday } from 'utils'
import './Schedule.css'

const wrapperStyle = {
  backgroundColor: 'black',
  padding: 2,
  borderColor: colors.darkGray,
}

const labelStyle = {
  color: 'white',
}

class YAxisTick extends React.PureComponent {
  render() {
    const { x, y, payload } = this.props

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
          {numeral(payload.value).format('0,0.0a').toUpperCase()}{' '}
        </text>
      </g>
    )
  }
}

class Schedule extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: 0,
      height: 0,
    }

    this.refContainer = this.refContainer.bind(this)
  }

  refContainer(element) {
    if (element) {
      const rect = element.getBoundingClientRect()
      if (this.state.width !== rect.width || this.state.height !== rect.height) {
        this.setState({
          width: rect.width,
          height: rect.height,
        })
      }
    }
  }

  renderX = (props) => {
    const { x, y, payload } = props
    const { schedule } = this.props
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
          {schedule[payload.index].label}
        </text>
      </g>
    )
  }

  render() {
    const { schedule } = this.props
    return (
      <div className="schedule" ref={this.refContainer}>
        <h3>Schedule</h3>
        <LineChart
          width={this.state.width}
          height={this.state.height - 50}
          data={schedule}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis dataKey="label" stroke={colors.darkGray} tick={this.renderX} />
          <YAxis stroke={colors.darkGray} tick={<YAxisTick />} />
          <Line dataKey="MANA" />
          <Line dataKey="USD" />
          <Line dataKey="amount" stroke={colors.green} strokeWidth={2} />
          <Tooltip wrapperStyle={wrapperStyle} labelStyle={labelStyle} />
          <ReferenceLine x={getToday()} stroke={colors.lightBlue} />
        </LineChart>
      </div>
    )
  }
}

export default Schedule
