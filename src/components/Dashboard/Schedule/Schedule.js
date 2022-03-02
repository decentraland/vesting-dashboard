import "./Schedule.css";
import React, { useState, useEffect } from "react";
import { Header, Narrow } from "decentraland-ui";
import { FormattedDate, FormattedMessage, FormattedPlural, FormattedNumber } from "react-intl";
import Info from "../../Info/Info";
import { getMonthDiff } from "utils";
import FutureIcon from "../../../images/future_events_icon.svg";

function Schedule(props) {
  const { contract } = { ...props };
  const { symbol, start, cliff, duration, releaseLogs } = contract;
  const vestingCliff = getMonthDiff(start, cliff);

  const [scheduleEvents, setScheduleEvents] = useState([]);

  const scheduleEvent = (message, timestamp = 0, future = false) => {
    return (
      <li key={Math.random()} className={`${future ? "future" : ""}`}>
        <div className="timeline__event">
          {future ? (
            <></>
          ) : (
            <Header sub style={{ textTransform: "none", margin: 0 }}>
              <FormattedDate value={new Date(timestamp * 1000)} year="numeric" month="long" day="numeric" />
            </Header>
          )}
          <Header style={{ fontSize: "15px", margin: 0 }}>{message}</Header>
        </div>
      </li>
    );
  };

  const showMore = (onClick) => {
    return (
      <li key="showMore" className="more" style={{ cursor: "pointer" }} onClick={onClick}>
        <div className="timeline__event">
          <Header sub style={{ fontSize: "11px" }}>
            <FormattedMessage id="shedule.show_more" />
          </Header>
        </div>
      </li>
    );
  };

  const scheduleEventsSetpUp = (fullShow = false) => {
    const eventList = [];
    eventList.push(scheduleEvent(<FormattedMessage id={"shedule.contract_started"} />, start));
    eventList.push(
      scheduleEvent(
        <FormattedMessage
          id={"shedule.cliff_started"}
          values={{
            months: vestingCliff,
            monthsPl: (
              <FormattedPlural
                value={vestingCliff}
                one={<FormattedMessage id="global.month" />}
                other={<FormattedMessage id="global.month.pl" />}
              />
            ),
          }}
        />,
        start
      )
    );

    if (new Date(cliff * 1000) < new Date()) {
      eventList.push(scheduleEvent(<FormattedMessage id="shedule.cliff_ended" />, cliff));
      eventList.push(scheduleEvent(<FormattedMessage id="shedule.vesting_begins" />, cliff));
    }

    const endContractTs = start + duration;
    const endContractDate = new Date(endContractTs * 1000);
    let fulfilledFlag = false;

    if (releaseLogs.length > 0) {
      if (releaseLogs.length > 1 && !fullShow) {
        eventList.push(showMore(() => scheduleEventsSetpUp(true)));
        const latestRelease = releaseLogs[releaseLogs.length - 1];
        if (new Date(latestRelease.timestamp * 1000) > endContractDate) {
          fulfilledFlag = true;
        }
        eventList.push(
          scheduleEvent(
            <FormattedMessage
              id="shedule.released"
              values={{ amount: <FormattedNumber value={Math.round(latestRelease.amount)} />, token: symbol }}
            />,
            latestRelease.timestamp
          )
        );
      } else {
        for (const log of releaseLogs) {
          if (!fulfilledFlag && new Date(log.timestamp * 1000) > endContractDate) {
            fulfilledFlag = true;
            eventList.push(scheduleEvent(<FormattedMessage id="shedule.fulfilled" />, endContractTs));
          }

          eventList.push(
            scheduleEvent(
              <FormattedMessage
                id="shedule.released"
                values={{ amount: <FormattedNumber value={Math.round(log.amount)} />, token: symbol }}
              />,
              log.timestamp
            )
          );
        }
      }
    }

    if (!fulfilledFlag) {
      if (new Date() >= new Date(endContractTs * 1000)) {
        eventList.push(scheduleEvent(<FormattedMessage id="shedule.fulfilled" />, endContractTs));
      } else {
        eventList.push(scheduleEvent(<img src={FutureIcon} className="Future__Icon" />, 0, true));
        eventList.push(scheduleEvent(<FormattedMessage id="shedule.fulfilled" />, 0, true));
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
      <ul>{scheduleEvents}</ul>
    </div>
  );
}

export default Schedule;
