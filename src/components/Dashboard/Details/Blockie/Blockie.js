import React, { Component } from 'react'
import blockies from 'ethereum-blockies/blockies'

class Blockie extends Component {
  getOpts() {
    return {
      seed: this.props.seed.toLowerCase(),
      color: '#e449c2',
      bgcolor: '#3149de',
      spotcolor: '#e449c2',
      size: 6,
      scale: 3,
    }
  }
  componentDidMount() {
    this.draw()
  }
  draw() {
    blockies.render(this.getOpts(), this.canvas)
  }
  render() {
    return React.createElement('canvas', { ref: (canvas) => (this.canvas = canvas) })
  }
}

export default Blockie
