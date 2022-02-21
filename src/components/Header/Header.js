import { Logo } from "decentraland-ui";
import React, { Component } from "react";
import { Container, Grid } from "semantic-ui-react";
import "./Header.css";
class Header extends Component {
  render() {
    return (
      <div className="header">
        <Container style={{ height: "auto", alignItems: "flex-start" }}>
          <Grid verticalAlign="middle">
            <Grid.Row>
              <Grid.Column style={{ width: "fit-content" }}>
                <Logo />
              </Grid.Column>
              <Grid.Column style={{ padding: 0 }}>
                <h1 className="header-title">Decentraland</h1>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Header;
