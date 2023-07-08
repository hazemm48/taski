import React from "react";

const Search = (props) => {
  let searchData = () => {
    let formEl = document.forms.search;
    let formData = new FormData(formEl);
    let searchIn = formData.get("search").trim().toLowerCase();
    props.search(searchIn);
    if (searchIn == "") {
      props.search();
    }
  };

  return (
    <form id="search" method="post" className="ml-auto">
      <div className="form">
        <div className="form-group col-sm-12">
          <div className="input-group ">
            <input
              name="search"
              className="form-control"
              placeholder="search by title"
            />
            <div class="input-group-append">
              <button
                type="button"
                className="input-group-text"
                id="basic-addon2"
                onClick={() => {
                  searchData();
                }}
              >
                <i className="las la-search" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Search;
