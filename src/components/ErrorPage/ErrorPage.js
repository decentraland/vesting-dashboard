import { Logo } from "decentraland-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "semantic-ui-react";

function ErrorPage(props) {
  const { connectionError } = props;

  const intl = useIntl();

  let errorText = intl.formatMessage({ id: "helper.error_page" }, { error: connectionError || "null" });
  if (connectionError && connectionError.indexOf("Failed to fetch") !== -1) {
    errorText = (
      <p className="error">
        <FormattedMessage id="helper.error_page.no_internet" />
      </p>
    );
  }

  return (
    <Container className="Error">
      <Logo />
      <h3>
        <FormattedMessage id="helper.error_page.message" />
      </h3>
      <p>{errorText}</p>
    </Container>
  );
}

export default React.memo(ErrorPage);
