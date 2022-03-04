import React from "react";
import { Header } from "decentraland-ui";
import { FormattedDate } from "react-intl";

function ScheduleEvent(props) {
  const { message, timestamp = 0, elementKey, future = false } = { ...props };

  return (
    <li key={elementKey} className={`${future ? "future" : ""}`}>
      <div className="timeline__event" key={`${elementKey}-div`}>
        {future ? (
          <div key={`${elementKey}-empty`}></div>
        ) : (
          <Header sub style={{ textTransform: "none", margin: 0 }} key={`${elementKey}-ts`}>
            <FormattedDate value={new Date(timestamp * 1000)} year="numeric" month="long" day="numeric" />
          </Header>
        )}
        <Header style={{ fontSize: "15px", margin: 0 }} key={`${elementKey}-message`}>
          {message}
        </Header>
      </div>
    </li>
  );
}

export default React.memo(ScheduleEvent);
