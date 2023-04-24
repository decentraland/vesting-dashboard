import './Schedule.css'
import React, { useState, useEffect, useMemo } from 'react'
import { Header } from 'decentraland-ui'
import { FormattedMessage, FormattedPlural, FormattedNumber } from 'react-intl'
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive'
import Info from '../../Info/Info'
import { getMonthDiff } from '../../../utils'
import FutureIcon from '../../../images/future_events_icon.svg'
import ScheduleEvent from './ScheduleEvent'
import ShowMore from './ShowMore'
import useResponsive from '../../../hooks/useResponsive'
import { TopicByVersion } from '../../../modules/constants'

function addReleasedEvent(eventList, amount, token, timestamp) {
  const props = { timestamp, key: timestamp }
  eventList.push(
    <ScheduleEvent
      message={
        <FormattedMessage
          id="schedule.released"
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
      message={<FormattedMessage id="schedule.fulfilled" />}
      {...props}
    />
  )
}

function addRevokedEvent(eventList, timestamp) {
  const props = { timestamp, key: 'revoked' }
  eventList.push(
    <ScheduleEvent
      message={<FormattedMessage id="schedule.revoked" />}
      {...props}
    />
  )
}

function addPausedEvent(eventList, timestamp) {
  const props = { timestamp, key: `paused-${timestamp}` }
  eventList.push(
    <ScheduleEvent
      message={<FormattedMessage id="schedule.paused" />}
      {...props}
    />
  )
}

function addUnpausedEvent(eventList, timestamp) {
  const props = { timestamp, key: `unpaused-${timestamp}` }
  eventList.push(
    <ScheduleEvent
      message={<FormattedMessage id="schedule.unpaused" />}
      {...props}
    />
  )
}

function Schedule(props) {
  const { contract } = props
  const { symbol, start, cliff, duration, logs, version } = contract
  const vestingCliff = getMonthDiff(start, cliff)

  const filteredLogs = useMemo(() => logs.filter((log) => log.topic !== TopicByVersion[version].TRANSFER_OWNERSHIP), [logs, version])

  const [scheduleEvents, setScheduleEvents] = useState([])
  const [revokedOrPaused, setRevokedOrPaused] = useState(false)

  const Topic = TopicByVersion[version]

  const scheduleEventsSetpUp = (fullShow = false) => {
    const eventList = []
    eventList.push(
      <ScheduleEvent
        message={<FormattedMessage id={'schedule.contract_started'} />}
        timestamp={start}
        key="contract_started"
      />
    )
    eventList.push(
      <ScheduleEvent
        message={
          <FormattedMessage
            id={'schedule.cliff_started'}
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
          message={<FormattedMessage id="schedule.cliff_ended" />}
          timestamp={cliff}
          key="cliff_ended"
        />
      )
      eventList.push(
        <ScheduleEvent
          message={<FormattedMessage id="schedule.vesting_begins" />}
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
          addRevokedEvent(eventList, logData.timestamp)
          break

        case Topic.PAUSED:
          addPausedEvent(eventList, logData.timestamp)
          break

        case Topic.UNPAUSED:
          addUnpausedEvent(eventList, logData.timestamp)
          break

        default:
          break
      }
    }

    if (filteredLogs.length > 0) {
      if (filteredLogs.length > 1 && !fullShow) {
        eventList.push(
          <ShowMore key="showMore" onClick={() => scheduleEventsSetpUp(true)} />
        )
        const latestLog = filteredLogs[filteredLogs.length - 1]
        const { timestamp } = latestLog.data

        if (new Date(timestamp * 1000) > endContractDate) {
          fulfilledFlag = true
        }

        addEventHandler(latestLog)
      } else {
        for (const log of filteredLogs) {
          const { timestamp } = log.data
          if (!fulfilledFlag && new Date(timestamp * 1000) > endContractDate) {
            fulfilledFlag = true
            addFulfilledEvent(eventList, endContractTs)
          }

          addEventHandler(log)
        }
      }
    }

    if (!revokedOrPaused) {
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
    // eslint-disable-next-line
  }, [revokedOrPaused])

  useEffect(() => {
    const cpLogs = [...filteredLogs]

    cpLogs.sort((a, b) => a.data.timestamp - b.data.timestamp)

    for (const log of cpLogs) {
      switch (log.topic) {
        case Topic.REVOKE:
        case Topic.PAUSED:
          setRevokedOrPaused(true)
          break
        case Topic.UNPAUSED:
          setRevokedOrPaused(false)
          break
        default:
      }
    }
  }, [Topic, filteredLogs])

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth })

  return (
    <div className={`timeline ${revokedOrPaused && 'revoked'}`}>
      <Header sub>
        <FormattedMessage id="schedule.title" />
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
