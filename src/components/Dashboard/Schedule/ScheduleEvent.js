import React from 'react'
import { Header } from 'decentraland-ui'
import { formatDate } from 'decentraland-dapps/dist/lib/utils'

function ScheduleEvent(props) {
  const { message, timestamp = 0, future = false } = props

  return (
    <li className={`${future ? 'future' : ''}`}>
      <div className="timeline__event">
        {!future && (
          <Header sub style={{ textTransform: 'none', margin: 0 }}>
            {formatDate(new Date(timestamp * 1000), 'MMMM D, YYYY')}
          </Header>
        )}
        <Header style={{ fontSize: '15px', margin: 0 }}>{message}</Header>
      </div>
    </li>
  )
}

export default React.memo(ScheduleEvent)
