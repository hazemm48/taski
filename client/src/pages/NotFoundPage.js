import React from "react";
import { Link } from "react-router-dom";
import notFound from "../images/5224483.jpg";

const NotFoundPage = () => {
  return (
    <div className="main-content">
      <div className="container-fluid notFound">
        <section class="page-not-found">
          <img src={notFound} />
          <h1>Page Not Found</h1>
          <p>
            Sorry can't find the page you are looking for
            <Link to="/home"> click Here</Link> to go back to home page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default NotFoundPage;
