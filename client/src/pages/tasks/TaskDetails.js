import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Loading.js";
import InputsHandler from "../../components/InputsHandler.js";
import { taskApi } from "../../APIs.js";
import { io } from "socket.io-client";
import Timer from "../../components/Timer.js";
import moment from "moment";

const TaskDetails = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [connected, setConnected] = useState(false);
  const [htmlData, setHtmlData] = useState([]);
  const socket = useRef();

  const { state } = useLocation();
  const dateFormat = (date) => {
    return moment(date).format("DD-MM-YYYY h:mm:ss A");
  };

  useEffect(() => {
    const inputs = [
      ["input", "Title", "title", "text"],
      ["textarea", "Description", "description", 3000],
      ["select", "Priority", "priority", ["low", "medium", "high"]],
      ["input", "created at", "createdAt", "text"],
    ];
    if (data) {
      if (data.status != "pending") {
        data.start = dateFormat(data.time.start);
        inputs.push(["input", "start date", "start", "text"]);
      }
      if (data.status == "done") {
        data.end = dateFormat(data.time.end);
        inputs.push(["input", "end date", "end", "text"]);
      }
    }
    setHtmlData(inputs);
  }, [data]);

  const getTasks = async () => {
    let url = `?filter[_id]=${state}`;
    let { tasks } = await taskApi("GET", url);
    tasks[0].createdAt = dateFormat(tasks[0].createdAt);
    setData(tasks[0]);
    setLoading(false);
  };

  const startConnection = () => {
    const socketIo = io("http://localhost:3000", {
      query: `_id=${state}&userId=${userId}&time=${moment().format(
        "YYYY/MM/DD HH:mm:ss"
      )}`,
    });
    socketIo.on("tracking", (msg) => {
      if (msg == "true") {
        alert("can't track more than one task at the same time");
      } else {
        setConnected(true);
        socket.current = socketIo;
      }
    });
  };

  const stopConnection = () => {
    socket.current.disconnect();
    setConnected(false);
  };

  const handleTask = async (con) => {
    let body = {
      id: state,
    };
    console.log(con);
    con == "start"
      ? (body.data = { "time.start": moment().toDate(), status: "in progress" })
      : (body.data = { "time.end": moment().toDate(), status: "done" });
    let { updated } = await taskApi("PUT", "", JSON.stringify(body));
    setData(updated);
    con == "start" ? startConnection() : stopConnection();
  };

  useEffect(() => {
    getTasks();
    setLoading(true);
  }, []);

  useEffect(() => {
    return () => {
      console.log(connected);
      if (socket.current?.connected) {
        stopConnection();
      }
    };
  }, []);
  const navigate = useNavigate();

  const editTask = () => {
    let elements = document.forms.form.querySelectorAll(
      "input,textarea,select"
    );
    let x = false;
    elements.forEach((e, i) => {
      if (!["createdAt", "start", "end"].includes(e.name)) {
        if (e.hasAttribute("readOnly")) {
          e.removeAttribute("readOnly");
          document.getElementById("editPat").innerHTML = "submit";
          return (x = false);
        } else {
          e.setAttribute("readOnly", "");
          document.getElementById("editPat").innerHTML = "submit";
          return (x = true);
        }
      }
    });
    x && updateTask();
  };

  const updateTask = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let obj = {};
    for (const pair of formData.entries()) {
      console.log(pair[0]);
      if (!(pair[0] == "createdAt")) {
        obj[pair[0]] = pair[1];
      }
    }

    let body = JSON.stringify({
      id: state,
      data: obj,
    });
    let update = await taskApi("PUT", "", body);
    alert(update.message);
    if (update.message == "updated") {
      setData(update.updated);
    }
  };

  const taskDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task")) {
      let body = JSON.stringify({
        _id: state,
      });
      let deleted = await taskApi("DELETE", "", body);
      console.log(deleted);
      alert(deleted.message);
      if (deleted.message == "deleted") {
        navigate(-1);
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      const tx = document.getElementsByTagName("textarea");
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute(
          "style",
          "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
        );
      }
    }
  }, [loading]);

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <>
              <div className="section row title-section">
                <div className="col-md-4">
                  <div aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to={"/home"}>
                          <a>Tasks</a>
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {data.title}
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="col-md-4">
                  <label
                    name="available"
                    class={`label-${
                      data.status == "pending"
                        ? "blue"
                        : data.status == "in progress"
                        ? "orange"
                        : "green"
                    } label-md`}
                    data-status={data.status}
                    disabled
                  >
                    {data.status}
                  </label>
                </div>
                <div className="col-md-4">
                  <button
                    id="editPat"
                    className="btn btn-dark-red-f-gr"
                    onClick={editTask}
                  >
                    <i className="las la-edit" />
                    edit task
                  </button>
                </div>
              </div>
              <div className="section patient-details-section">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card container">
                          <div className="card-body">
                            <form id="form">
                              <InputsHandler
                                handler={htmlData}
                                data={data}
                                disable={true}
                              />
                            </form>
                          </div>
                        </div>
                      </div>
                      {data.status == "in progress" && (
                        <div className="col-sm-12">
                          <div className="card">
                            <button
                              className="btn btn-dark-red-f-gr"
                              onClick={() => {
                                handleTask("end");
                              }}
                            >
                              <i className="las la-stopwatch" />
                              end task
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="col-sm-12">
                        <div className="card">
                          <button
                            className="btn btn-red-f-gr"
                            onClick={taskDelete}
                          >
                            <i className="las la-trash" />
                            delete task
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="card files-card">
                      <div className="card-header">
                        <Timer
                          data={data}
                          connected={connected}
                          stopConnection={stopConnection}
                          startConnection={startConnection}
                          startTask={handleTask}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
