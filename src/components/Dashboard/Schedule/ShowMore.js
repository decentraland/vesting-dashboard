import React from "react";
import { Header } from "decentraland-ui";
import { FormattedMessage } from "react-intl";

function ShowMore(props) {
  const { onClick } = props;
  return (
    <li className="more" style={{ cursor: "pointer" }} onClick={onClick}>
      <div className="timeline__event">
        <Header sub style={{ fontSize: "11px" }}>
          <FormattedMessage id="shedule.show_more" />
        </Header>
      </div>
    </li>
  );
}

export default React.memo(ShowMore);
