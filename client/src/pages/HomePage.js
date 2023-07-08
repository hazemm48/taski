import React, { useState } from "react";
import { Link } from "react-router-dom";
import welcome from "../images/79755644.jpg";
import TasksManager from "./tasks/TasksManager.js";

const HomePage = ({ user }) => {
  const [tasksLength, setTasksLength] = useState();

  let cards = [
    ["/tasks", "la-calendar-check", "view tasks"],
    ["/addTask", "la-plus-circle", "add new task"]
];

  return (
    <div className="main-content">
      <div className="container-fluid">
        {
          user && (
            <>
              <div className="section">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="page-title">Home</h5>
                  </div>
                </div>
              </div>
              <div className="section welcome-section">
                <div className="section-content">
                  <div className="card-deck">
                    <div className="card welcome-content-card col-md-10">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-8 welcome-text-wrapper align-self-center">
                            <h3>
                              Hello,{" "}
                              <span style={{ color: "#0466c8" }}>
                                {user.name}
                              </span>
                            </h3>
                            <h5>Welcome to your task manager</h5>
                          </div>
                          <div class="col-md-4 welcome-img-wrapper">
                            <img src={welcome} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card app-stats-card col-md-2">
                      <div className="card-body">
                        <div className="text-center">
                          <i className="las la-calendar-check la-3x align-self-center" />
                          <p>total tasks</p>
                          <h4>{tasksLength||0}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section functionality-section">
                <div className="section-content">
                  <div className="card-deck">
                    {cards.map((e) => {
                      return (
                        <Link
                          to={e[0]}
                          state={user._id}
                          className="card text-center"
                        >
                          <div className="card-title">
                            <div className="icon-wrapper">
                              <i className={`las ${e[1]}`} />
                            </div>
                          </div>
                          <div className="card-body">
                            <p>{e[2]}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="section card-summaries">
                <div className="section-content">
                  <div className="card-deck">
                    <div className="card">
                      <div className="card-header">
                        <h5>My tasks</h5>
                      </div>
                      <div className="card-body">
                        <TasksManager setTasksLength={setTasksLength} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default HomePage;
