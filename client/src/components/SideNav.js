import React from "react";
import { NavLink } from "react-router-dom";

const SideNav = ({ id }) => {
  let data = [
    ["/home", "la-shapes", "Home"],
    ["/tasks", "la-calendar-check", "Tasks"],
    ["/settings", "la-user-cog", "Settings"],
  ];
  return (
    <div className="side-nav">
      <ul className="list-group list-group-flush">
        {data.map((e) => {
          return (
            <NavLink
              to={e[0]}
              state={id ? id : false}
              className="list-group-item"
              data-toggle="tooltip"
              data-placement="bottom"
            >
              <i className={`las ${e[1]} la-lw`} />
              <span>{e[2]}</span>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNav;
