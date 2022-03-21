import React, { useEffect } from 'react'

// Source: https://crypto.com/price/widget

function ManaWidget() {
  const widgetUrl = 'https://crypto.com/price/static/widget/index.js'

  useEffect(() => {
    const script = document.createElement('script')
    script.src = widgetUrl

    document.body.appendChild(script)

    return () => document.body.removeChild(script)
  }, [])

  return (
    <div
      id="crypto-widget-CoinList"
      data-design="classic"
      data-coins="decentraland"
      style={{ width: '100%' }}
    />
  )
}

export default ManaWidget
