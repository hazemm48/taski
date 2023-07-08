import React from "react";

const SortDropdown = (props) => {
  return (
    <div className="dropdowns-wrapper">
      <div className="dropdown">
        <select
          id={props.type}
          className="form-select dropdown-toggle"
          role="button"
          onChange={() => {
            props.setLoading(true);
            props.GetDetails();
          }}
        >
          {props.sortValues.map((e) => {
            if (e[0] == props.selOpt) {
              return (
                <option selected value={e[0]}>
                  {e[1]}
                </option>
              );
            }
            return <option value={e[0]}>{e[1]}</option>;
          })}
        </select>
      </div>
    </div>
  );
};

export default SortDropdown;
