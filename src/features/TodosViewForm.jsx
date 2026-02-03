import { useState, useEffect } from "react";

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500)
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);
  function preventRefresh(e) {
    e.preventDefault();
  }
  return (
    <form className="viewForm" onSubmit={preventRefresh}>
      <div className="row">
        <label className="label" htmlFor="search">
          Search todos:
        </label>
        <input
          className="input"
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        ></input>
        <button
          className="btn btnDanger"
          type="button"
          onClick={() => setLocalQueryString('')}
        >
          Clear
        </button>
      </div>
      <div className="row row2">
        <div className="field">
          <label className="label" htmlFor="sotr-by">
            Sort by
          </label>
          <select
            className="select"
            id="sotr-by"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">{'Title'}</option>
            <option value="createdTime">{'Time added'}</option>
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="direction">
            Direction
          </label>
          <select
            className="select"
            id="direction"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">{'Ascending'}</option>
            <option value="desc">{'Descending'}</option>
          </select>
        </div>
      </div>
    </form>
  );
}

export default TodosViewForm
