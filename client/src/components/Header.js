import React from "react";
import { useNavigate, Link } from "react-router-dom";
import userImg from "../images/male.jpg";

const Header = ({ user }) => {
  let navigate = useNavigate();

  const dropMenu = () => {
    let headerDrop = document.getElementById("headerDrop");
    if (headerDrop.classList.contains("show")) {
      document.getElementById("headerDrop").classList.remove("show");
      document.getElementById("drop").classList.remove("show");
      document.getElementById("aria").setAttribute("aria-expanded", "false");
    } else {
      document.getElementById("headerDrop").classList.add("show");
      document.getElementById("drop").classList.add("show");
      document.getElementById("aria").setAttribute("aria-expanded", "true");
    }
  };

  const logout = () => {
    delete localStorage.token;
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="navbar-collapse">
          <ul className="navbar-nav">
            <li id="headerDrop" className="nav-item" onClick={dropMenu}>
              <a
                className="nav-link profile-dropdown"
                id="aria"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img className="rounded-circle" src={userImg} />
                <span className="blue-text">{user.name}</span>
              </a>
              <div className="dropdown">
                <div
                  id="drop"
                  className="dropdown-menu shadow-lg profile-dropdown-menu"
                  aria-labelledby="profile-dropdown"
                >
                  <Link to="/settings" className="dropdown-item">
                    <i className="las la-cog mr-2" />
                    settings
                  </Link>
                  <a className="dropdown-item" onClick={logout}>
                    <i className="las la-sign-out-alt mr-2" />
                    logout
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
