import React from "react";
import { Header } from "decentraland-ui";
import { FormattedDate } from "react-intl";

function ScheduleEvent(props) {
  const { message, timestamp = 0, future = false } = props;

  return (
    <li className={`${future ? "future" : ""}`}>
      <div className="timeline__event">
        {!future && (
          <Header sub style={{ textTransform: "none", margin: 0 }}>
            <FormattedDate value={new Date(timestamp * 1000)} year="numeric" month="long" day="numeric" />
          </Header>
        )}
        <Header style={{ fontSize: "15px", margin: 0 }}>{message}</Header>
      </div>
    </li>
  );
}

export default React.memo(ScheduleEvent);
