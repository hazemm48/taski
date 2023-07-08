import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/Loading.js";
import InputsHandler from "../../components/InputsHandler.js";
import { taskApi } from "../../APIs.js";
const AddTask = () => {
  const [loading, setLoading] = useState(false);


  const htmlData = [
    ["input", "Title", "title", "text"],
    ["textarea", "Description", "description", 1000],
    ["select", "Priority", "priority", ["low", "medium", "high"]],
  ];

  const addTask = async () => {
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let body = {};
    for (let pair of formData) {
      body[pair[0]] = pair[1];
    }
    body.title = body.title.toLowerCase();
    body = JSON.stringify(body);
    let add = await taskApi("POST", "", body);
    alert(add.message);
    setLoading(false);
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="section">
              <h5 className="page-title">Add new task</h5>
            </div>
            <div className="section profile-section">
              <div className="card container">
                <div className="card-body">
                  <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                    <div className="sub-section-body">
                      <div className="user-password-form">
                        <form id="form">
                          <InputsHandler handler={htmlData} />
                        </form>
                        <button
                          className="btn btn-dark-red-f-gr mt-4"
                          type="button"
                          onClick={() => {
                            addTask();
                            setLoading(true);
                          }}
                        >
                          <i className="las la-save" />
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddTask;
