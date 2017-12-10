import React, { PureComponent } from "react";
import { Route, Link } from "react-router";
import "./User.css";

class User extends PureComponent {
  render() {
    const { name, goAbout } = this.props;
    return (
      <div className="user">
        <p>{name}</p>
        <button onClick={goAbout}>About</button>
      </div>
    );
  }
}

export default User;
