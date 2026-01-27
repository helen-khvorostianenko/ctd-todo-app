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
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        ></input>
        <button type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </button>
      </div>
      <div>
        <label htmlFor="sotr-by">Sort by</label>
        <select
          id="sotr-by"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">{'Title'}</option>
          <option value="createdTime">{'Time added'}</option>
        </select>
        <label htmlFor="direction">Direction</label>
        <select
          id="direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">{'Ascending'}</option>
          <option value="desc">{'Descending'}</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm
