import React from "react";
import { Header, Popup, Button } from "decentraland-ui";
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedPlural } from "react-intl";
import { getMonthDiff } from "../../../utils";
import Info from "../../Info/Info";
import AddressIcon from "../../../images/address_icon.svg";
import "./Details.css";

function addressShortener(address) {
  return address.substring(0, 6) + "..." + address.substring(38, 42);
}

function Details(props) {
  const { contract, isBeneficiary, onRelease } = props;
  const { symbol, released, balance, start, cliff, duration, releasableAmount, revocable } = contract;
  const vestingCliff = getMonthDiff(start, cliff);

  const copyAddress = () => {
    navigator.clipboard.writeText(contract.beneficiary);
  };

  return (
    <div id="details">
      <Header sub>
        <FormattedMessage id="details.beneficiary" />
      </Header>
      <Header onClick={copyAddress} style={{ cursor: "pointer" }}>
        <img style={{ width: "13px", marginRight: "5px", paddingBottom: "5px" }} src={AddressIcon} />
        <Popup
          content={<FormattedMessage id="global.copied" />}
          position="bottom center"
          trigger={<span>{addressShortener(contract.beneficiary)}</span>}
          on="click"
        />
        <Info message={<FormattedMessage id="helper.beneficiary" />} position="top center" />
      </Header>
      <Header sub>
        <FormattedMessage id="details.start" />
      </Header>
      <Header>
        <FormattedDate value={new Date(start * 1000)} year="numeric" month="long" day="numeric" />
      </Header>
      <Header sub>
        <FormattedMessage id="details.end" />
      </Header>
      <Header>
        <FormattedDate value={new Date((start + duration) * 1000)} year="numeric" month="long" day="numeric" />
      </Header>
      <Header sub>
        <FormattedMessage id="details.cliff_period" />
      </Header>
      <Header>
        <FormattedMessage
          id="details.cliff_period.time"
          values={{
            cliff: vestingCliff,
            monthPl: (
              <FormattedPlural
                value={vestingCliff}
                one={<FormattedMessage id="global.month" />}
                other={<FormattedMessage id="global.month.plural" />}
              />
            ),
          }}
        />
        <Info message={<FormattedMessage id="helper.cliff_period" />} position="top center" />
      </Header>
      <Header sub>
        <FormattedMessage id="details.total_vesting" />
      </Header>
      <Header>
        <FormattedNumber value={balance + released} /> {symbol}
        <Info message={<FormattedMessage id="helper.total_vesting" />} position="top center" />
      </Header>
      <Header sub>
        <FormattedMessage id="details.released" />
      </Header>
      <Header>
        <FormattedNumber value={released} /> {symbol}
        <Info message={<FormattedMessage id="helper.released" />} position="top center" />
      </Header>
      <Header sub>
        <FormattedMessage id="details.releasable" />
      </Header>
      <Header style={(isBeneficiary && { marginBottom: "4px" }) || {}}>
        <FormattedNumber value={releasableAmount} /> {symbol}
        <Info message={<FormattedMessage id="helper.releasable" />} position="top center" />
      </Header>
      {isBeneficiary && releasableAmount > 0 && (
        <Button basic style={{ padding: 0, marginBottom: "14px" }} onClick={onRelease}>
          <FormattedMessage id="details.release_funds" />
        </Button>
      )}
      <Header sub>
        <FormattedMessage id="details.revocable" />
      </Header>
      <Header>{revocable ? <FormattedMessage id="global.yes" /> : <FormattedMessage id="global.no" />}</Header>
    </div>
  );
}

export default React.memo(Details);
