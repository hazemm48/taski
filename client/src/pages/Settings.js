import React from "react";
import userImg from "../images/male.jpg";
import { deleteUser } from "../APIs.js";
import ChangePassword from "../components/ChangePassword.js";

const Settings = ({ user }) => {
  const delUser = async () => {
    let { message } = await deleteUser();
    console.log(message);
    alert(message);
    if (message == "deleted") {
      localStorage.clear();
      window.location = "/";
    }
  };

  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="section">
          <h5 className="page-title">settings</h5>
        </div>
        <div className="section profile-section">
          <div className="card container">
            <div className="card-header">
              <h5>personal details</h5>
            </div>
            <div className="card-body">
              <div className="sub-section col-lg-10 col-md-12">
                <div className="sub-section-body">
                  <div className="row">
                    <div className="col-lg-2 col-md-4">
                      <img
                        className="rounded-circle"
                        src={userImg}
                        style={{ height: "10em" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-section col-md-12 col-lg-8">
                <div className="sub-section-body">
                  <div className="user-details-form">
                    <div className="form">
                      <div className="form-group col-sm-6">
                        <label>Name</label>
                        <input
                          className="form-control"
                          defaultValue={user.name}
                          disabled
                        />
                      </div>
                      <div className="form-group col-lg-6">
                        <label>email address</label>
                        <input
                          className="form-control"
                          defaultValue={user.email}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ChangePassword />
          <div className="card container">
            <button className="btn btn-red-f-gr" onClick={delUser}>
              <i className="las la-trash" />
              delete acoount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
