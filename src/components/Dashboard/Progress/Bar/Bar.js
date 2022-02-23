import React from "react";
import "./Bar.css";

function Bar(props) {
  const { vested, released } = props;

  return (
    <div className="bar__container">
      <div className="bar vested" style={{ width: `${vested}%` }} />
      <div className="bar released" style={{ width: `${released}%` }} />
    </div>
  );
}

export default Bar;
