import React from "react";

const InputsHandler = (props) => {
  let { handler, disable, data } = props;

  return (
    <div className="form">
      {handler?.map((e) => {
        if (e[0] == "input") {
          return (
            <div className="form-group col-sm-8" id={e[2]}>
              <label>{e[1]}</label>
              <input
                className="form-control"
                name={e[2]}
                type={e[3]}
                readOnly={disable}
                required={e[2] != "doctorName" ? true : false}
                defaultValue={data ? data[e[2]] : ""}
              />
            </div>
          );
        } else if (e[0] == "select") {
          return (
            <div className="form-group col-sm-8" id={e[2]}>
              <label>{e[1]}</label>
              <select
                className="form-control form-select dropdown-toggle"
                name={e[2]}
                readOnly={disable}
                required
              >
                {e[3].map((o) => {
                  if (data && o == data[e[2]]) {
                    return (
                      <option selected value={o}>
                        {o}
                      </option>
                    );
                  } else {
                    return <option value={o}>{o}</option>;
                  }
                })}
              </select>
            </div>
          );
        } else if (e[0] == "textarea") {
          return (
            <div className="form-group col-sm-8">
              <label>{e[1]}</label>
              <textarea
                className="form-control "
                readOnly={disable}
                defaultValue={data ? data[e[2]] : ""}
                rows="6"
                maxlength={e[3]}
                name={e[2]}
                required
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default InputsHandler;
