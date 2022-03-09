import "./Schedule.css";
import React, { useState, useEffect } from "react";
import { Header } from "decentraland-ui";
import { FormattedMessage, FormattedPlural, FormattedNumber } from "react-intl";
import Info from "../../Info/Info";
import { getMonthDiff } from "../../../utils";
import FutureIcon from "../../../images/future_events_icon.svg";
import ScheduleEvent from "./ScheduleEvent";
import ShowMore from "./ShowMore";

function Schedule(props) {
  const { contract } = { ...props };
  const { symbol, start, cliff, duration, releaseLogs } = contract;
  const vestingCliff = getMonthDiff(start, cliff);

  const [scheduleEvents, setScheduleEvents] = useState([]);

  const scheduleEventsSetpUp = (fullShow = false) => {
    const eventList = [];
    eventList.push(
      <ScheduleEvent
        message={<FormattedMessage id={"shedule.contract_started"} />}
        timestamp={start}
        key="contract_started"
      />
    );
    eventList.push(
      <ScheduleEvent
        message={
          <FormattedMessage
            id={"shedule.cliff_started"}
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
        key={"cliff_started"}
      />
    );

    if (new Date(cliff * 1000) < new Date()) {
      eventList.push(
        <ScheduleEvent message={<FormattedMessage id="shedule.cliff_ended" />} timestamp={cliff} key="cliff_ended" />
      );
      eventList.push(
        <ScheduleEvent
          message={<FormattedMessage id="shedule.vesting_begins" />}
          timestamp={cliff}
          key="vesting_begins"
        />
      );
    }

    const endContractTs = start + duration;
    const endContractDate = new Date(endContractTs * 1000);
    let fulfilledFlag = false;

    if (releaseLogs.length > 0) {
      if (releaseLogs.length > 1 && !fullShow) {
        eventList.push(<ShowMore key="showMore" onClick={() => scheduleEventsSetpUp(true)} />);
        const latestRelease = releaseLogs[releaseLogs.length - 1];
        const { timestamp } = latestRelease;

        if (new Date(timestamp * 1000) > endContractDate) {
          fulfilledFlag = true;
        }

        eventList.push(
          <ScheduleEvent
            message={
              <FormattedMessage
                id="shedule.released"
                values={{ amount: <FormattedNumber value={Math.round(latestRelease.amount)} />, token: symbol }}
              />
            }
            timestamp={timestamp}
            key={timestamp}
          />
        );
      } else {
        for (const log of releaseLogs) {
          const { timestamp, amount } = log;
          if (!fulfilledFlag && new Date(timestamp * 1000) > endContractDate) {
            fulfilledFlag = true;
            eventList.push(
              <ScheduleEvent
                message={<FormattedMessage id="shedule.fulfilled" />}
                timestamp={endContractTs}
                key="fulfilled"
              />
            );
          }

          eventList.push(
            <ScheduleEvent
              message={
                <FormattedMessage
                  id="shedule.released"
                  values={{ amount: <FormattedNumber value={Math.round(amount)} />, token: symbol }}
                />
              }
              timestamp={timestamp}
              key={timestamp}
            />
          );
        }
      }
    }

    if (!fulfilledFlag) {
      if (new Date() >= new Date(endContractTs * 1000)) {
        eventList.push(
          <scheduleEvents
            message={<FormattedMessage id="shedule.fulfilled" />}
            timestamp={endContractTs}
            key="fulfilled"
          />
        );
      } else {
        eventList.push(
          <ScheduleEvent message={<img src={FutureIcon} className="Future__Icon" />} key="Future__Icon" future />
        );
        eventList.push(<ScheduleEvent message={<FormattedMessage id="shedule.fulfilled" />} key="fulfilled" future />);
      }
    }

    setScheduleEvents(eventList);
  };

  useEffect(() => {
    scheduleEventsSetpUp();
  }, []);

  return (
    <div className="timeline">
      <Header sub>
        <FormattedMessage id="shedule.title" />
        <Info message={<FormattedMessage id="helper.vesting_schedule" />} position="top center" />
      </Header>
      <ul key={"timeline"}>{scheduleEvents}</ul>
    </div>
  );
}

export default React.memo(Schedule);
