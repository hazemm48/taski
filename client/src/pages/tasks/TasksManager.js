import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/Loading.js";
import Search from "../../components/Search.js";
import {
  PagenationNavigate,
  PagenationResult,
} from "../../components/Pagenation.js";
import SortDropdown from "../../components/SortDropdown.js";
import { taskApi } from "../../APIs.js";

const TasksManager = (props) => {
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [length, setLength] = useState();
  const [srchFilter, setSrchFilter] = useState();
  const [taskList, setTaskList] = useState();

  let resultLimit = 10;
  let table = ["title", "priority", "status", ""];
  let typeValues = [
    ["all", "all"],
    ["[priority]=high", "high priority"],
    ["[priority]=medium", "medium priority"],
    ["[priority]=low", "low priority"],
    ["[status]=done", "done"],
    ["[status]=in progress", "in progress"],
    ["[status]=pending", "pending"],
  ];

  let sortValues = [
    ["title:1", "Title ascending"],
    ["title:-1", "Title descending"],
    ["createdAt:-1", "Newest"],
    ["createdAt:1", "Oldest"],
  ];

  const getTasks = async () => {
    let currentPage = "";
    document.getElementsByName("page").forEach((e) => {
      if (e.parentElement.classList.contains("active")) {
        currentPage = e.tabIndex;
      }
    });
    setPageNo(currentPage);

    let sort = document.getElementById("sort").value;
    let filter = document.getElementById("filter").value;
    let url = `?sort=${sort}&pageNo=${pageNo}&limit=${resultLimit}`;

    srchFilter && (url = url + `&filter[title]=${srchFilter}`);
    filter != "all" && (url = url + `&filter${filter}`);

    let { tasks, count } = await taskApi("GET", url);
    filter == "all" && props.setTasksLength(count);
    setTaskList(tasks);
    setLength(count);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getTasks();
  }, [srchFilter]);

  return (
    <>
      <div className="container-fluid">
        <div className="section filters-section">
          sort:
          <SortDropdown
            type="sort"
            sortValues={sortValues}
            setLoading={setLoading}
            GetDetails={getTasks}
            selOpt={"title:1"}
          />
          filter:
          <SortDropdown
            type="filter"
            sortValues={typeValues}
            setLoading={setLoading}
            GetDetails={getTasks}
            selOpt={"all"}
          />
          <Search search={setSrchFilter} type={"product"} />
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <PagenationResult
              pageNo={pageNo}
              length={length}
              resultLimit={resultLimit}
            />
            <div id="tv" className={`section patients-table-view`}>
              <table className="table table-hover table-responsive-lg">
                <thead>
                  <tr>
                    {table?.map((e) => {
                      return <th>{e}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {taskList &&
                    taskList.map((p) => {
                      return (
                        <tr id={p._id}>
                          <td>
                            <p name="name">{p.title}</p>
                          </td>
                          <td>{p.priority}</td>
                          <td>
                            <label
                              name="available"
                              class={`label-${
                                p.status == "pending"
                                  ? "blue"
                                  : p.status == "in progress"
                                  ? "orange"
                                  : "green"
                              } label-md`}
                              data-status={p.status}
                              disabled
                            >
                              {p.status}
                            </label>
                          </td>
                          <td>
                            <Link to={`/taskDetails`} state={p._id}>
                              <button
                                id="editPat"
                                name={p._id}
                                className="view-more btn btn-sm btn-dark-red-f"
                              >
                                view
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <PagenationNavigate
        length={length}
        resultLimit={resultLimit}
        setLoading={setLoading}
        GetDetails={getTasks}
      />
    </>
  );
};

export default TasksManager;
