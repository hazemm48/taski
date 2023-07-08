import React from "react";

const PagenationResult = (props) => {
  let { pageNo, length, resultLimit } = props;

  return (
    <div
      class="section "
      id="data-table6_info"
      role="status"
      aria-live="polite"
    >
      Showing{" "}
      <span style={{ color: "#00b4d8" }}>
        {pageNo < Math.ceil(length / resultLimit)
          ? (pageNo - 1) * resultLimit + resultLimit
          : length}
      </span>{" "}
      out of <span style={{ color: "#00b4d8" }}>{length} </span>results
    </div>
  );
};

const PagenationNavigate = (props) => {
  let { length, resultLimit } = props;

  let pagination = () => {
    let pages = [];
    for (let i = 2; i <= Math.ceil(length / resultLimit); i++) {
      pages.push(
        <li
          class="page-item"
          onClick={(e) => {
            changePage(e);
          }}
        >
          <button class="page-link" name="page" tabIndex={i}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  let changePage = (e) => {
    let btn = document.getElementsByName("page");
    Array.from(btn).map((e) => {
      e.parentElement.classList.remove("active");
    });
    e.target.parentElement.classList.add("active");
    props.setLoading(true);
    props.GetDetails();
  };

  return (
    <div aria-label="Page navigation example" className="section">
      <ul class="pagination justify-content-start">
        <li class="page-item disabled">
          <a class="page-link" tabindex="-1">
            Pages
          </a>
        </li>
        <li
          class="page-item active"
          onClick={(e) => {
            changePage(e);
          }}
        >
          <button class="page-link" name="page" tabIndex="1">
            1
          </button>
        </li>
        {pagination()}
      </ul>
    </div>
  );
};

export { PagenationResult, PagenationNavigate };
