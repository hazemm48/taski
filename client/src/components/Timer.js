import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";

const Timer = ({
  data,
  connected,
  stopConnection,
  startConnection,
  startTask,
}) => {
  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [milliSeconds, setMilliseconds] = useState(data.time?.totalMin || 0);

  const interval = () => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    setDay(Math.floor(milliSeconds / day));
    setHours(Math.floor((milliSeconds % day) / hour));
    setMinutes(Math.floor((milliSeconds % hour) / minute));
    setSeconds(Math.floor((milliSeconds % minute) / second));
    setMilliseconds(milliSeconds + second);
  };

  useEffect(() => {
    interval();
  }, []);

  useEffect(() => {
    if (data.status == "in progress" && connected) {
      let int = setInterval(interval, 1000);
      return () => clearInterval(int);
    }
  });

  return (
    <>
      <div className="timer">
        <h1 id="headline">Total task time</h1>
        <div id="countdown">
          <ul>
            <li>
              <span id="days">{day}</span>
              days
            </li>
            <li>
              <span id="hours">{hours + " :"}</span>
              Hours
            </li>
            <li>
              <span id="minutes">{minutes + " :"}</span>
              Minutes
            </li>
            <li>
              <span id="seconds">{seconds}</span>
              Seconds
            </li>
          </ul>
        </div>
      </div>
      {data.status != "done" && (
        <button
          id="editPat"
          style={{ width: "100%" }}
          className={`btn btn${connected ? "" : "-dark"}-red-f-gr`}
          onClick={() => {
            if (connected) {
              stopConnection();
            } else {
              if (data.status == "pending") {
                startTask("start");
              } else if (data.status == "in progress") {
                startConnection();
              }
            }
          }}
        >
          {!connected
            ? data.status == "pending"
              ? "start"
              : "continue"
            : "stop"}
        </button>
      )}
    </>
  );
};

export default Timer;
