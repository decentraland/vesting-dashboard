import './Schedule.css'
import React, { useState, useEffect } from 'react'
import { Header } from 'decentraland-ui'
import { FormattedMessage, FormattedPlural, FormattedNumber } from 'react-intl'
import Info from '../../Info/Info'
import { getMonthDiff } from '../../../utils'
import FutureIcon from '../../../images/future_events_icon.svg'
import ScheduleEvent from './ScheduleEvent'
import ShowMore from './ShowMore'
import { Topic } from '../../../modules/constants'
import useResponsive from '../../../hooks/useResponsive'
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive'

function addReleasedEvent(eventList, amount, token, timestamp) {
  const props = { timestamp, key: timestamp }
  eventList.push(
    <ScheduleEvent
      message={
        <FormattedMessage
          id="shedule.released"
          values={{
            amount: <FormattedNumber value={Math.round(amount)} />,
            token: token,
          }}
        />
      }
      {...props}
    />
  )
}

function addFulfilledEvent(eventList, timestamp, future = false) {
  const props = { timestamp, future, key: 'fulfilled' }
  eventList.push(
    <ScheduleEvent
      message={<FormattedMessage id="shedule.fulfilled" />}
      {...props}
    />
  )
}

function addRevokedEvent(eventList, timestamp) {
  const props = { timestamp, key: 'revoked' }
  eventList.push(
    <ScheduleEvent
      message={<FormattedMessage id="shedule.revoked" />}
      {...props}
    />
  )
}

function Schedule(props) {
  const { contract } = props
  const { symbol, start, cliff, duration, logs } = contract
  const vestingCliff = getMonthDiff(start, cliff)

  const [scheduleEvents, setScheduleEvents] = useState([])
  const [revoked, setRevoked] = useState(false)

  const scheduleEventsSetpUp = (fullShow = false) => {
    const eventList = []
    eventList.push(
      <ScheduleEvent
        message={<FormattedMessage id={'shedule.contract_started'} />}
        timestamp={start}
        key="contract_started"
      />
    )
    eventList.push(
      <ScheduleEvent
        message={
          <FormattedMessage
            id={'shedule.cliff_started'}
            values={{
              months: vestingCliff,
              monthsPl: (
                <FormattedPlural
                  value={vestingCliff}
                  one={<FormattedMessage id="global.month" />}
                  other={<FormattedMessage id="global.month.plural" />}
                />
              ),
            }}
          />
        }
        timestamp={start}
        key={'cliff_started'}
      />
    )

    if (new Date(cliff * 1000) < new Date()) {
      eventList.push(
        <ScheduleEvent
          message={<FormattedMessage id="shedule.cliff_ended" />}
          timestamp={cliff}
          key="cliff_ended"
        />
      )
      eventList.push(
        <ScheduleEvent
          message={<FormattedMessage id="shedule.vesting_begins" />}
          timestamp={cliff}
          key="vesting_begins"
        />
      )
    }

    const endContractTs = start + duration
    const endContractDate = new Date(endContractTs * 1000)
    let fulfilledFlag = false

    const addEventHandler = (log) => {
      const logData = log.data
      switch (log.topic) {
        case Topic.RELEASE:
          addReleasedEvent(eventList, logData.amount, symbol, logData.timestamp)
          break

        case Topic.REVOKE:
          setRevoked(true)
          addRevokedEvent(eventList, logData.timestamp)
          break

        default:
          break
      }
    }

    if (logs.length > 0) {
      if (logs.length > 1 && !fullShow) {
        eventList.push(
          <ShowMore key="showMore" onClick={() => scheduleEventsSetpUp(true)} />
        )
        const latestLog = logs[logs.length - 1]
        const { timestamp } = latestLog.data

        if (new Date(timestamp * 1000) > endContractDate) {
          fulfilledFlag = true
        }

        addEventHandler(latestLog)
      } else {
        for (const log of logs) {
          const { timestamp } = log.data
          if (!fulfilledFlag && new Date(timestamp * 1000) > endContractDate) {
            fulfilledFlag = true
            addFulfilledEvent(eventList, endContractTs)
          }

          addEventHandler(log)
        }
      }
    }

    if (!revoked) {
      if (!fulfilledFlag) {
        if (new Date() >= new Date(endContractTs * 1000)) {
          addFulfilledEvent(eventList, endContractTs)
        } else {
          eventList.push(
            <ScheduleEvent
              message={<img src={FutureIcon} className="Future__Icon" alt="" />}
              key="Future__Icon"
              future
            />
          )
          addFulfilledEvent(eventList, 0, true)
        }
      }
    }

    setScheduleEvents(eventList)
  }

  useEffect(() => {
    scheduleEventsSetpUp()
  }, [revoked])

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth })

  return (
    <div className={`timeline ${revoked && 'revoked'}`}>
      <Header sub>
        <FormattedMessage id="shedule.title" />
        <Info
          message={<FormattedMessage id="helper.vesting_schedule" />}
          position={`${isMobile ? 'right' : 'top'} center`}
        />
      </Header>
      <ul>{scheduleEvents}</ul>
    </div>
  )
}

export default React.memo(Schedule)
