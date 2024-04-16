import { useEffect, useRef } from 'react'

// Source: https://crypto.com/price/widget

function ManaWidget() {
  const widgetUrl = 'https://crypto.com/price/static/widget/index.js'
  const script = useRef(null)

  useEffect(() => {
    const appendScript = () => {
      script.current = document.createElement('script')
      script.current.src = widgetUrl

      document.body.appendChild(script.current)
    }

    appendScript()

    const removeScript = () => {
      document.body.removeChild(script.current)
    }

    return () => removeScript()
  }, [])

  return <div id="crypto-widget-CoinList" data-design="classic" data-coins="decentraland" style={{ width: '100%' }} />
}

export default ManaWidget
