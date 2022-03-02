import React from "react";
import "./Schedule.css";

function Schedule(props) {
  const { contract } = props;
  console.log(contract);

  return (
    <div class="timeline">
      <ul>
        <li>
          <div className="timeline__event">
            <div>uno</div>
            <div>subtexto</div>
          </div>
        </li>
        <li>
          <div className="timeline__event">
            <div>dos</div>
            <div>subtexto</div>
          </div>
        </li>
        <li className="more">
          <div className="timeline__event">show more</div>
        </li>
        <li>
          <div className="timeline__event">
            <div>N</div>
            <div>subtexto</div>
          </div>
        </li>
        <li className="future">
          <div className="timeline__event">puntitos</div>
        </li>
        <li className="future">
          <div className="timeline__event">fulfilled</div>
        </li>
      </ul>
    </div>
  );
}

export default Schedule;
