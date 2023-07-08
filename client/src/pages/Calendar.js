import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { taskApi } from "../APIs.js";

const Calendar = (props) => {
  const [data, setData] = useState();
  const [events, setEvents] = useState();
  const [month, setMonth] = useState(moment().get("month") + 1);
  const [year, setYear] = useState(moment().get("year"));
  const [status, setStatus] = useState("all");
  const [cusBtns, setCusBtns] = useState();
  const [startDate, setStartDate] = useState(moment().toDate());

  let navigate = useNavigate();

  let calenderRef = createRef();

  const platform = /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(
    navigator.userAgent
  );

  const osCheck = () => {
    console.log(navigator.userAgent);
    if (platform) {
      return "listWeek";
    } else {
      return "dayGridMonth";
    }
  };

  useLayoutEffect(() => {
    if (platform) {
      document.querySelector(".fc-view-harness").style.height = "500px";
    }
  }, []);

  useEffect(() => {
    let arr = ["all", "pending", "inProgress", "done"];
    let obj = {};
    arr.map((e) => {
      obj[e] = {
        text: e,
        click: () => {
          e == "inProgress" && (e = "in progress");
          setStatus(e);
        },
      };
    });
    setCusBtns(obj);
  }, []);

  const getTasks = async () => {
    let url = `?filter[month]=${month}&filter[year]=${year}`;
    status != "all" && (url += `&filter[status]=${status}`);
    let { tasks } = await taskApi("GET", url);
    console.log(tasks);
    setData(tasks);
  };

  let addEvents = () => {
    let obj = [];
    let dateFormat = (date) => moment(date).format("YYYY-MM-DD HH:mm");
    data.map((e) => {
      let eventObj = {
        id: e._id,
        title: e.title,
        display: "block",
      };
      if (e.status == "done") {
        eventObj.start = dateFormat(e.time.start);
        eventObj.end = dateFormat(e.time.end);
        eventObj.color = "green";
      } else if (e.status == "in progress") {
        eventObj.start = dateFormat(e.time.start);
        eventObj.end = dateFormat();
        eventObj.color = "orange";
      } else {
        eventObj.start = dateFormat(e.createdAt);
        eventObj.end = dateFormat(e.createdAt);
        eventObj.color = "blue";
      }
      obj.push(eventObj);
    });
    setEvents(obj);
  };

  useEffect(() => {
    getTasks();
  }, [month, status]);

  useEffect(() => {
    if (data) {
      addEvents();
    }
  }, [data]);

  let handleDateClick = (args) => {
    let calenderApi = calenderRef.current.getApi();
    calenderApi.changeView("timeGridDay", args);
  };

  const handleEventClick = (args) => {
    let state = args.event.id;
    navigate(`/taskDetails`, {
      state,
    });
  };

  let handleDateChange = (args) => {
    setStartDate(args.start);
    let date = moment(args.start);
    setMonth(date.get("month") + 1);
    setYear(date.get("year"));
  };
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <div className="App">
            <FullCalendar
              ref={calenderRef}
              customButtons={cusBtns}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
                bootstrap5Plugin,
              ]}
              headerToolbar={{
                left: "prev,next today all,pending,inProgress,done",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              initialDate={startDate}
              selectable={true}
              themeSystem={"bootstrap5"}
              initialView={osCheck()}
              datesSet={handleDateChange}
              showNonCurrentDates={false}
              events={events}
              eventClick={handleEventClick}
              navLinks={true}
              navLinkDayClick={handleDateClick}
              dayMaxEventRows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
