import React from 'react'
import { Header } from 'decentraland-ui'
import { formatDate } from 'decentraland-dapps/dist/lib/utils'
import { DATE_FORMAT_LONG } from '../../../utils'

function ScheduleEvent(props) {
  const { message, timestamp = 0, future = false } = props

  return (
    <li className={`${future ? 'future' : ''}`}>
      <div className="timeline__event">
        {!future && (
          <Header sub style={{ textTransform: 'none', margin: 0 }}>
            {formatDate(new Date(timestamp * 1000), DATE_FORMAT_LONG)}
          </Header>
        )}
        <Header style={{ fontSize: '15px', margin: 0 }}>{message}</Header>
      </div>
    </li>
  )
}

export default React.memo(ScheduleEvent)
