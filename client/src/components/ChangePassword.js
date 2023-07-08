import React from "react";
import { changePass } from "../APIs.js";

const ChangePassword = () => {
  const changePassword = async (body) => {
    if (body) {
      let update = await changePass(body);
      if (update.message == "wrong old password") {
        document.getElementById("wrong").style.visibility = "visible";
      } else if (update.message == "password changed") {
        document.getElementById("wrong").style.visibility = "hidden";
        alert("Password changed successfully");
        document.getElementById("passForm").reset();
      } else {
        alert("something went wrong");
      }
    }
  };

  const validate = () => {
    document.getElementById("passForm").addEventListener("submit", (e) => {
      e.preventDefault();
    });
    let oldPass = document.getElementById("oldPass");
    let newPass = document.getElementById("newPass");
    let cNewPass = document.getElementById("cNewPass");
    let { x, y } = false;
    if ((oldPass.value && newPass.value && cNewPass.value) != "") {
      if (oldPass.value == newPass.value) {
        oldPass.classList.add("is-invalid");
        x = false;
      }
      if (oldPass.value != newPass.value) {
        oldPass.classList.remove("is-invalid");
        x = true;
      }
      if (cNewPass.value != newPass.value) {
        cNewPass.classList.add("is-invalid");
        y = false;
      }
      if (cNewPass.value == newPass.value) {
        cNewPass.classList.remove("is-invalid");
        y = true;
      }
      if (x && y) {
        let body = {
          oldPass: oldPass.value,
          newPass: newPass.value,
        };
        changePassword(body);
      }
    }
  };

  return (
    <div className="card container">
      <div className="card-header">
        <h5>password</h5>
      </div>
      <div className="card-body">
        <div className="sub-section col-sm-8 col-md-12 col-lg-8">
          <div className="sub-section-body">
            <form
              id="passForm"
              className="needs-validation"
              onsubmit="return false"
              novalidate
              pre
            >
              <div className="user-password-form needs-validation">
                <div className="form-row">
                  <div className="form-group col-sm-8">
                    <label>current password</label>
                    <input id="oldPass" className="form-control" required />
                    <div class="invalid-feedback">
                      New password is the same current password
                    </div>
                  </div>
                  <div className="form-group col-sm-8">
                    <label>new password</label>
                    <input id="newPass" className="form-control" required />
                  </div>
                  <div className="form-group col-sm-8">
                    <label>re-type new password</label>
                    <input id="cNewPass" className="form-control" required />
                    <div class="invalid-feedback">Passwords doesn't match</div>
                  </div>
                </div>
                <button
                  id="passBut"
                  className="btn btn-dark-red-f-gr mt-4"
                  onClick={validate}
                >
                  <i className="las la-sync" />
                  change my password
                </button>
                <div id="wrong" style={{ visibility: "hidden", color: "red" }}>
                  Wrong old password
                </div>
              </div>
            </form>
            <div id="success" style={{ visibility: "hidden", color: "green" }}>
              Password changed successfully
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
