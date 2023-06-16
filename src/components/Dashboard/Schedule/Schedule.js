import './Schedule.css'
import React, { useState, useEffect, useMemo } from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatNumber } from 'decentraland-dapps/dist/lib/utils'
import Info from '../../Info/Info'
import { getMonthDiff } from '../../../utils'
import FutureIcon from '../../../images/future_events_icon.svg'
import ScheduleEvent from './ScheduleEvent'
import ShowMore from './ShowMore'
import useResponsive, { onlyMobileMaxWidth } from '../../../hooks/useResponsive'
import { TopicByVersion } from '../../../modules/constants'

function addReleasedEvent(eventList, amount, token, timestamp) {
  const props = { timestamp, key: timestamp }
  eventList.push(
    <ScheduleEvent
      message={t('schedule.released', {
        amount: formatNumber(Math.round(amount), 0),
        token: token,
      })}
      {...props}
    />
  )
}

function addFulfilledEvent(eventList, timestamp, future = false) {
  const props = { timestamp, future, key: 'fulfilled' }
  eventList.push(<ScheduleEvent message={t('schedule.fulfilled')} {...props} />)
}

function addRevokedEvent(eventList, timestamp) {
  const props = { timestamp, key: 'revoked' }
  eventList.push(<ScheduleEvent message={t('schedule.revoked')} {...props} />)
}

function addPausedEvent(eventList, timestamp) {
  const props = { timestamp, key: `paused-${timestamp}` }
  eventList.push(<ScheduleEvent message={t('schedule.paused')} {...props} />)
}

function addUnpausedEvent(eventList, timestamp) {
  const props = { timestamp, key: `unpaused-${timestamp}` }
  eventList.push(<ScheduleEvent message={t('schedule.unpaused')} {...props} />)
}

function Schedule(props) {
  const { contract } = props
  const { symbol, start, cliff, duration, logs, version } = contract
  const vestingCliff = getMonthDiff(start, cliff)

  const filteredLogs = useMemo(
    () => logs.filter((log) => log.topic !== TopicByVersion[version].TRANSFER_OWNERSHIP),
    [logs, version]
  )

  const [scheduleEvents, setScheduleEvents] = useState([])
  const [revokedOrPaused, setRevokedOrPaused] = useState(false)

  const Topic = TopicByVersion[version]

  const scheduleEventsSetpUp = (fullShow = false) => {
    const eventList = []
    eventList.push(<ScheduleEvent message={t('schedule.contract_started')} timestamp={start} key="contract_started" />)
    eventList.push(
      <ScheduleEvent
        message={t('schedule.cliff_started', {
          months: vestingCliff,
          monthsPl: vestingCliff === 1 ? t('global.month') : t('global.month.plural'),
        })}
        timestamp={start}
        key={'cliff_started'}
      />
    )

    if (new Date(cliff * 1000) < new Date()) {
      eventList.push(<ScheduleEvent message={t('schedule.cliff_ended')} timestamp={cliff} key="cliff_ended" />)
      eventList.push(<ScheduleEvent message={t('schedule.vesting_begins')} timestamp={cliff} key="vesting_begins" />)
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
        eventList.push(<ShowMore key="showMore" onClick={() => scheduleEventsSetpUp(true)} />)
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
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })

  return (
    <div className={`timeline ${revokedOrPaused && 'revoked'}`}>
      <Header sub>
        {t('schedule.title')}
        <Info message={t('helper.vesting_schedule')} position={`${isMobile ? 'right' : 'top'} center`} />
      </Header>
      <ul>{scheduleEvents}</ul>
    </div>
  )
}

export default React.memo(Schedule)
